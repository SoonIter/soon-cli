import { describe, expect, it } from 'vitest';
import { succeedSpiner } from '..';
describe('hello', () => {
  it('hello2', () => {
    expect(succeedSpiner).toMatchInlineSnapshot('[Function]')
  })
});
