import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm', 'cjs'],
  sourcemap: true,
  entry: ['./src/index.ts', './src/config.ts'],
  dts: true,
});
