import { writeFileSync } from 'fs';
import { join, relative } from 'path';
import type { CommandModule } from 'yargs';
import fg from 'fast-glob';
import { fail, success, withSpinner } from '../lib';
interface Args { path: string; ts: boolean;importFrom: string[] }

const REG = /\.c?[tj]sx?$/;
export const getExportEntries = (paths: string[], indexPath: string) => {
  const entries = paths.filter(pathItem => REG.test(pathItem)).map((pathItem) => {
    return relative(indexPath, pathItem).replace(REG, '');
  }).reduce((prev, curr) => {
    if (curr === 'index')
      return prev;
    if (prev.includes(curr))
      return prev;
    if (curr.startsWith('/'))
      return prev;
    if (/[a-z]/.test(curr[0]))
      curr = `./${curr}`;
    prev.push(curr);
    return prev;
  }, [] as string[]);
  return entries;
};

export const generateIndexFile = async ({ path: indexPath, ts, importFrom }: Args) => {
  const entries = getExportEntries(await fg(importFrom, { dot: true }), indexPath);
  const exportsRaw = entries.map((pathItem) => {
    return `export * from '${pathItem}';`;
  }).join('\n');
  writeFileSync(
    join(indexPath, `./index.${ts ? 't' : 'j'}s`),
    exportsRaw,
    {
      flag: 'w',
    },
  );
};
const handler = async (args: Args) => {
  try {
    await withSpinner(generateIndexFile, { text: 'generating the index file' })(args);
    success('创建index.ts成功');
  }
  catch (err) {
    if (err instanceof Error)
      fail(err.message);
    else fail('未知错误');
  }
};

export default {
  command: 'glob [importFrom ...]',
  describe: 'generate export * from [importFrom] automatically',
  builder: {
    path: {
      description: 'the index.ts directory',
      required: false,
      alias: 'p',
      default: '.',
      string: true,
    },
    typescript: {
      description: 'the index.ts path',
      required: false,
      alias: 'ts',
      default: true,
      boolean: true,
    },
  },
  handler: handler as any,
} satisfies CommandModule;
