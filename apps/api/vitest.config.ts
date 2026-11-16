import { defineConfig } from 'vitest/config';

/** API integration tests against Postgres. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.integration.ts'],
    setupFiles: ['./test/env.ts'],
    fileParallelism: false,
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
