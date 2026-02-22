import { env } from '@/lib/config/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API ${status}`);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch(`${env.gatewayUrl}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-Gateway-Auth-Key': env.gatewayAuthKey },
  })
    .then((r) => r.ok)
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  return refreshPromise;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
};

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = new URL(path, env.gatewayUrl);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = opts;

  const headers: Record<string, string> = {
    'X-Gateway-Auth-Key': env.gatewayAuthKey,
    ...customHeaders,
  } as Record<string, string>;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(buildUrl(path, params), {
    credentials: 'include',
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    const ok = await tryRefresh();
    if (ok) {
      const retry = await fetch(buildUrl(path, params), {
        credentials: 'include',
        ...rest,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (retry.ok) {
        return retry.status === 204 ? (undefined as T) : retry.json();
      }
      throw new ApiError(retry.status, await retry.json().catch(() => null));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sq:auth-expired'));
    }
    throw new ApiError(401, { error: 'Session expired' });
  }

  if (!res.ok) {
    throw new ApiError(res.status, await res.json().catch(() => null));
  }

  return res.status === 204 ? (undefined as T) : res.json();
}
