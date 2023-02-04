import path from 'path';
import inquirer from 'inquirer';
import { replaceStringInFiles } from 'tiny-replace-files';
import { cwd, fail, fs, startSpinner, warn } from '../lib/index';
const { existsSync } = fs;

const handler = async (folderName: string, cmdArgs?: any) => {
  try {
    // 获取项目路径
    const currDir = (cmdArgs && cmdArgs.context) || cwd;
    const targetDir = path.join(currDir, folderName);
    startSpinner('正在复制');
    if (fs.existsSync('./template')) {
      const isExisted = existsSync(targetDir);
      if (isExisted) {
        const { yes } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'yes',
            message: '目标文件夹已存在，是否覆盖？',
          },
        ]);
        if (!yes)
          return false;
      }
      await replaceStringInFiles({
        files: './template.ts/**',
        from: '[name]',
        to: folderName,
      });
    }
    else {
      warn(`未找到template,请确认template文件夹 在${currDir}目录下`);
    }
  }
  catch (err) {
    const e = err as Error;
    fail(e.message);
  }
};

export default {
  command: 'template <dir-name>',
  desc: '复制一个文件夹模板，并更名',
  handler,
};
