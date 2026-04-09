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

const AUTH_EXPIRED_CODES = new Set([
  'AUTH_EXPIRED',
  'SESSION_EXPIRED',
  'INVALID_REFRESH',
  'INVALID_REFRESH_TOKEN',
  'TOKEN_REUSED',
  'UNAUTHORIZED',
]);

function emitAuthExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sq:auth-expired'));
  }
}

function getErrorCode(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const code = (body as { code?: unknown }).code;
  return typeof code === 'string' ? code.toUpperCase() : null;
}

function isAuthExpiredResponse(status: number, body: unknown): boolean {
  if (status === 401) return true;
  const code = getErrorCode(body);
  if (!code) return false;
  if (status === 403 && AUTH_EXPIRED_CODES.has(code)) return true;
  return status >= 500 && AUTH_EXPIRED_CODES.has(code);
}

async function parseErrorBody(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch('/api/auth/refresh', {
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
  const url = new URL(path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = opts;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const requestBody = body === undefined ? undefined : (isFormData ? body : JSON.stringify(body));

  const headers: Record<string, string> = {
    'X-Gateway-Auth-Key': env.gatewayAuthKey,
    ...customHeaders,
  } as Record<string, string>;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(buildUrl(path, params), {
    credentials: 'include',
    ...rest,
    headers,
    body: requestBody,
  });

  if (res.status === 401) {
    const ok = await tryRefresh();
    if (ok) {
      const retry = await fetch(buildUrl(path, params), {
        credentials: 'include',
        ...rest,
        headers,
        body: requestBody,
      });
      if (retry.ok) {
        if (retry.status === 204) return undefined as T;
        const retryText = await retry.text();
        return retryText ? JSON.parse(retryText) : (undefined as T);
      }
      const retryBody = await parseErrorBody(retry);
      if (isAuthExpiredResponse(retry.status, retryBody)) emitAuthExpired();
      throw new ApiError(retry.status, retryBody);
    }

    emitAuthExpired();
    throw new ApiError(401, { error: 'Session expired' });
  }

  if (!res.ok) {
    const body = await parseErrorBody(res);
    if (isAuthExpiredResponse(res.status, body)) emitAuthExpired();
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}
