/**
 * MSW Browser Setup for development environment
 * Optional: Enable mocking in the browser during development
 * 
 * Usage in main.tsx or app entry point:
 * ```ts
 * if (import.meta.env.DEV) {
 *   worker.start();
 * }
 * ```
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the MSW worker with our handlers
export const worker = setupWorker(...handlers);
