import { AsyncLocalStorage } from 'node:async_hooks';
import type { RequestContext } from './request-context';

export const contextStore = new AsyncLocalStorage<RequestContext>();

export function getContext(): RequestContext {
  const ctx = contextStore.getStore();
  if (!ctx) {
    throw new Error('RequestContext not initialized');
  }
  return ctx;
}
