import path from 'path';
import { existsSync } from 'fs-extra';
import inquirer from 'inquirer';
import { replaceDirText } from '../lib/copy/replaceDirText';
import { cwd, failSpinner, fs, startSpinner, warn } from '../lib/index';

const action = async (folderName: string, cmdArgs?: any) => {
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
      await replaceDirText('./template', targetDir, {
        matchText: '[name]',
        replaceText: folderName,
      });
    }
    else {
      warn(`未找到template,请确认template文件夹 在${currDir}目录下`);
    }
  }
  catch (err) {
    const e = err as Error;
    failSpinner(e.message);
  }
};

export default {
  command: 'template <dir-name>',
  description: '复制一个文件夹模板，并更名',
  optionList: [['--context <context>', '上下文路径']],
  action,
} as ICommand;
