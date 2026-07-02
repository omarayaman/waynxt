import { isAxiosError } from 'axios';

export const TRIP_CREATE_TIMEOUT_MS = Number(
  process.env.NEXT_PUBLIC_TRIP_CREATE_TIMEOUT_MS ?? 20_000
);

export const TRIP_READ_TIMEOUT_MS = Number(
  process.env.NEXT_PUBLIC_TRIP_READ_TIMEOUT_MS ?? 12_000
);

export function isTimeoutError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout');
}

export function isNetworkError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ENOTFOUND' ||
    !error.response
  );
}

/** Server unreachable, timed out, or temporarily unavailable — safe to use mock data. */
export function shouldUseMockFallback(error: unknown): boolean {
  if (!isAxiosError(error)) return false;

  const status = error.response?.status;
  if (status === 401 || status === 403) return false;
  if (status === 503 || status === 502 || status === 504) return true;

  return isTimeoutError(error) || isNetworkError(error);
}

export function getMockFallbackReason(error: unknown): 'timeout' | 'unreachable' | 'server' {
  if (isTimeoutError(error)) return 'timeout';
  if (isNetworkError(error)) return 'unreachable';
  return 'server';
}
