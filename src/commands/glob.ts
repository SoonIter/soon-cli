import fg from 'fast-glob';
// import { program } from 'commander';
import { fail, fs, success } from '../lib';

const exec = async (pathArg: string | string[]) => {
  const pathArgs = Array.isArray(pathArg) ? pathArg : [pathArg];
  const entries = await fg(pathArgs, { dot: true });
  const exportsArr = entries.reduce((arr, pathItem) => {
    arr.push(`export * from '${pathItem.replace(/\.tsx?$/, '')}';`);
    return arr;
  }, [] as string[]);
  fs.writeFile(
    './index.ts',
    exportsArr.join('\n'),
    {
      flag: 'w',
    },
    (err) => {
      err && console.log(err);
    },
  );
};
const handler = () => {
  const pathArgs = process.argv
    .filter(s => s !== 'glob')
    .map(s => s.replace('"', ''));
  try {
    exec(pathArgs);
    success('创建index.ts成功');
  }
  catch (err) {
    if (err instanceof Error)
      fail(err.message);
    else fail('未知错误');
  }
};

export default {
  command: 'glob [path1] [path2]',
  desc: '自动生成 export * from [path]',
  handler,
};
