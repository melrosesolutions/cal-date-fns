import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      exclude: ['src/**/*.test.ts', 'src/index.ts', 'src/**/*.type.ts'],
      thresholds: {
        // Applies these minimums BOTH to the aggregate AND to every
        // individual file (perFile: true) — no single file may drop below
        // this, even if other files are at 100% and the average looks fine.
        //
        // Note: Vitest (tested on v2.1.9) does NOT enforce glob-scoped
        // per-file thresholds (e.g. 'src/**': { perFile: true, ... }) — that
        // form parses without error but silently fails to gate the build.
        // Only the top-level `perFile: true` flag genuinely works, which
        // means we can't currently have a higher aggregate bar alongside a
        // lower per-file minimum in one config. Re-test this if upgrading
        // vitest to v3+, since the migration guide documents different
        // (intended-to-be-correct) per-glob perFile behaviour for that line.
        perFile: true,
        statements: 80,
        branches: 80,
        functions: 100,
        lines: 80,
      },
    },
  },
});
