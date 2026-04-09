import { env } from '@/lib/config/env';

export interface SSEError {
  code: 'AUTH_EXPIRED' | 'CREDIT_EXCEEDED' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT';
  message: string;
  retryable: boolean;
}

export interface ToolCallInfo {
  tool: string;
  args: Record<string, unknown>;
}

export interface ToolResultInfo {
  tool: string;
  summary: string;
  durationMs: number;
}

export interface SSECallbacks {
  onProgress?: (step: string, message: string) => void;
  onThinking?: (text: string) => void;
  onToolCall?: (info: ToolCallInfo) => void;
  onToolResult?: (info: ToolResultInfo) => void;
  onResult?: (data: unknown) => void;
  onError?: (error: SSEError) => void;
  onComplete?: () => void;
}

const SSE_TIMEOUT_MS = 360_000;

function emitAuthExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sq:auth-expired'));
  }
}

function mapHttpStatus(status: number, body?: { code?: string; message?: string }): SSEError {
  if (status === 401) return { code: 'AUTH_EXPIRED', message: body?.message ?? 'Session expired', retryable: false };
  if (status === 429) return { code: 'RATE_LIMITED', message: body?.message ?? 'Too many requests', retryable: true };
  if (body?.code === 'CREDIT_EXCEEDED') return { code: 'CREDIT_EXCEEDED', message: body.message ?? 'Daily limit exceeded', retryable: false };
  return { code: 'SERVER_ERROR', message: body?.message ?? `Server error (${status})`, retryable: true };
}

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') url.searchParams.set(k, v);
  });
  return url.toString();
}

export function connectSSE(path: string, params: Record<string, string>, callbacks: SSECallbacks): AbortController {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    callbacks.onError?.({ code: 'TIMEOUT', message: 'Request timed out', retryable: true });
  }, SSE_TIMEOUT_MS);

  (async () => {
    try {
      const res = await fetch(buildUrl(path, params), {
        credentials: 'include',
        headers: { 'X-Gateway-Auth-Key': env.gatewayAuthKey, Accept: 'text/event-stream' },
        signal: controller.signal,
      });

      if (!res.ok) {
        clearTimeout(timeout);
        const body = await res.json().catch(() => ({}));
        const error = mapHttpStatus(res.status, body);
        if (error.code === 'AUTH_EXPIRED') emitAuthExpired();
        callbacks.onError?.(error);
        callbacks.onComplete?.();
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        clearTimeout(timeout);
        callbacks.onError?.({ code: 'NETWORK_ERROR', message: 'No response body', retryable: true });
        callbacks.onComplete?.();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() ?? '';

        for (const block of blocks) {
          if (!block.trim()) continue;
          let eventType = 'message';
          let data = '';
          for (const line of block.split('\n')) {
            if (line.startsWith('event:')) eventType = line.slice(6).trim();
            else if (line.startsWith('data:')) data = line.slice(5).trim();
          }
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            switch (eventType) {
              case 'progress':
                callbacks.onProgress?.(parsed.step, parsed.message);
                break;
              case 'thinking':
                callbacks.onThinking?.(parsed.text);
                break;
              case 'tool_call':
                callbacks.onToolCall?.({ tool: parsed.tool, args: parsed.args ?? {} });
                break;
              case 'tool_result':
                callbacks.onToolResult?.({ tool: parsed.tool, summary: parsed.summary, durationMs: parsed.durationMs ?? 0 });
                break;
              case 'result':
                callbacks.onResult?.(parsed);
                break;
              case 'error': {
                const code = parsed.code as SSEError['code'] | undefined;
                if (code === 'AUTH_EXPIRED') emitAuthExpired();
                callbacks.onError?.({
                  code: code ?? 'SERVER_ERROR',
                  message: parsed.message ?? 'Unknown error',
                  retryable: code !== 'CREDIT_EXCEEDED' && code !== 'AUTH_EXPIRED',
                });
                break;
              }
            }
          } catch {
            // non-JSON line (e.g. SSE comment) — skip
          }
        }
      }

      clearTimeout(timeout);
      callbacks.onComplete?.();
    } catch (e: unknown) {
      clearTimeout(timeout);
      if (controller.signal.aborted) return;
      const isNetwork = e instanceof TypeError;
      callbacks.onError?.({
        code: isNetwork ? 'NETWORK_ERROR' : 'SERVER_ERROR',
        message: e instanceof Error ? e.message : 'Connection failed',
        retryable: true,
      });
      callbacks.onComplete?.();
    }
  })();

  return controller;
}
