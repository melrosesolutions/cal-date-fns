import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // tsconfig.json only includes src/ (deliberately — it controls
          // the actual library build, see tsconfig.json's rootDir/outDir).
          // Root-level tool config files live outside that and would
          // otherwise fail with "was not found by the project service".
          // These don't need full type-aware linting, just basic parsing,
          // so they're allowed to fall back to a default project instead
          // of requiring a dedicated tsconfig entry.
          allowDefaultProject: ['*.config.ts', '*.config.mjs', '*.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // This file's own use of tseslint.config() is flagged as deprecated by
    // @typescript-eslint/no-deprecated. We're intentionally not migrating to
    // ESLint core's defineConfig() yet: the typescript-eslint maintainers
    // currently advise against it themselves, since it causes type errors
    // and no-unsafe-* false positives when configs are type-checked (see
    // typescript-eslint/typescript-eslint#11313). tseslint.config() still
    // works correctly, just not the long-term-recommended API — revisit
    // once that upstream type-incompatibility is resolved.
    files: ['eslint.config.mjs'],
    rules: {
      '@typescript-eslint/no-deprecated': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },
);
