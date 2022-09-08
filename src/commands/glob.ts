import fg from 'fast-glob';
import { program } from 'commander';
import { failSpinner, fs, succeedSpiner } from '../lib';

const exec = async (pathArg: string | string[], cmdArgs?: any) => {
  const pathArgs = typeof pathArg === 'string' ? [pathArg] : pathArg;
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
const action = (pathArg0: string, cmdArgs: any) => {
  const pathArgs = program.args
    .filter(s => s !== 'glob')
    .map(s => s.replace('"', ''));
  try {
    exec(pathArgs);
    succeedSpiner('创建index.ts成功');
  }
  catch (err) {
    if (err instanceof Error)
      failSpinner(err.message);
    else failSpinner('未知错误');
  }
};

export default {
  command: 'glob [path1] [path2]',
  description: '自动生成 export * from [path]',
  action,
} as ICommand;
