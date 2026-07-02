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

