import { describe, expect, it } from 'vitest';
import { succeedSpiner } from '..';
describe('hello', () => {
  it('hello2', () => {
    expect(succeedSpiner.toString()).toMatchInlineSnapshot(`
      "(text) => {
        spinner.stopAndPersist({
          symbol: \\"\\\\u{1F389}\\",
          text: __vite_ssr_import_1__.default.green(\`\${text}
      \`)
        });
      }"
    `)
  })
});
