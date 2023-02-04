import { describe, expect, it } from 'vitest';
import { success } from '../logger';
describe('hello', () => {
  it('hello2', () => {
    expect(success('123')).toMatchInlineSnapshot();
  });
});
