import { defineConfig } from 'tsup';

export default defineConfig({
  minify: false,
  format: ['esm'],
  sourcemap: true,
  dts: true,
});
