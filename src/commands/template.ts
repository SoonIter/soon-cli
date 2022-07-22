import path from 'path';
import {
  copyDir,
  cwd,
  failSpinner,
  fs,
  startSpinner,
  succeedSpiner,
  warn,
} from '../lib/index';

const action = async (folderName: string, cmdArgs?: any) => {
  try {
    // 获取项目路径
    const currDir = (cmdArgs && cmdArgs.context) || cwd;
    const targetDir = path.join(currDir, folderName);
    startSpinner('正在复制');
    if (fs.existsSync('./template')) {
      copyDir('./template', targetDir).then(() => {
        succeedSpiner('复制成功');
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
  description: '复制一个文件夹模板',
  optionList: [['--context <context>', '上下文路径']],
  action,
} as ICommand;
