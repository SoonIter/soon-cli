import { getExportEntries } from '../glob';
describe('getExportEntries', () => {
  it('getExportEntries should work', () => {
    const res = getExportEntries(['../index.ts', '../glob.ts', './index.ts', '../config.ts', './.gitignore', 'add.ts', '/users/hello.rs'], '.').sort();
    expect(res).deep.equal(JSON.parse(`
      [
        "../index",
        "../glob",
        "../config",
        "./add"
      ]
    `).sort());
  });
});
