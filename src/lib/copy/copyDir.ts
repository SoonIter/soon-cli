import { existsSync } from 'fs';
import fs from 'fs-extra';
import inquirer from 'inquirer';

// 复制文件夹所有
async function copyDir(srcDir: string, tarDir: string) {
  const isExisted = existsSync(tarDir);
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
    fs.copy(srcDir, tarDir, { overwrite: true, errorOnExist: true });
  }
  else {
    console.log('创建文件夹:', tarDir);
    fs.mkdirSync(tarDir);
    fs.copy(srcDir, tarDir, { overwrite: true, errorOnExist: true });
  }
}

export { copyDir };
