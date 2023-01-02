import { defineConfig } from 'tsup';

export default defineConfig({
  minify: false,
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
});
