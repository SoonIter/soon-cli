import { defineConfig } from 'tsup';

export default defineConfig({
  minify: false,
  format: ['cjs'],
  sourcemap: 'inline',
});
