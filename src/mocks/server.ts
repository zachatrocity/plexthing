/**
 * MSW Server Setup for Node.js testing environment
 * Used with Vitest/Jest test runners
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the MSW server with our handlers
export const server = setupServer(...handlers);
