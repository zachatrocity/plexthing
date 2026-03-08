/**
 * Vitest Test Setup
 * 
 * This file configures the test environment with MSW for API mocking.
 * Import this file in your vitest.config.ts using the `setupFiles` option.
 * 
 * Example vitest.config.ts:
 * ```ts
 * import { defineConfig } from 'vitest/config';
 * 
 * export default defineConfig({
 *   test: {
 *     setupFiles: ['./src/test/setup.ts'],
 *     environment: 'jsdom', // or 'happy-dom'
 *   },
 * });
 * ```
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server';

// Start the MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test to ensure isolation
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});
