import path from 'path';
import fg from 'fast-glob';
import { cwd, failSpinner, fs, startSpinner, succeedSpiner } from '../lib';

const exec = async (pathArg: string, cmdArgs?: any) => {
  const entries = await fg([pathArg]);
  const exportsArr = entries.reduce((arr, pathItem) => {
    arr.push(`export * from '${pathItem.replace(/\.ts$/, '')}';`);
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
const action = (pathArg: string, cmdArgs: any) => {
  try {
    const targetDir = pathArg.replace('"', '');
    exec(targetDir);
    succeedSpiner('创建index.ts成功');
  }
  catch (err) {
    if (err instanceof Error)
      failSpinner(err.message);
    else failSpinner('未知错误');
  }
};

export default {
  command: 'glob <path>',
  description: '自动生成 export * from <path>',
  // optionList: [['--context <context>', '上下文路径']],
  action,
} as ICommand;
