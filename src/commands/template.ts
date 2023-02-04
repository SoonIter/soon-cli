import { join, relative } from 'path';
import inquirer from 'inquirer';
import { replaceStringInFiles } from 'tiny-replace-files';
import type { CommandModule } from 'yargs';
import { copy, exists, remove } from 'fs-extra';
import { chalk, cwd, fail, warn, withSpinner } from '../lib/index';
const { cyan } = chalk;

const handler = async ({ templatePath, folderName }: { folderName: string; templatePath: string }) => {
  try {
    // 获取项目路径
    const currDir = cwd;
    const targetPath = join(currDir, folderName);
    templatePath = templatePath ?? join(cwd, 'template');

    if (await exists(templatePath)) {
      const isExisted = await exists(targetPath);
      if (isExisted) {
        const { yes } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'yes',
            message: '目标文件夹已存在，是否覆盖？',
          },
        ]);
        if (yes)
          await remove(targetPath);
        else
          return;
      }
    }
    else {
      warn(`未找到template,请确认template文件夹 在${currDir}目录下`);
      return;
    }

    await withSpinner(async () => {
      await copy(templatePath, targetPath);
      await replaceStringInFiles({
        files: join(targetPath, '**'),
        from: '[name]',
        to: folderName,
      });
    }, { text: `copy from ${cyan(templatePath)} to ${cyan(`./${relative(cwd, targetPath)}`)}` })();
  }
  catch (err) {
    const e = err as Error;
    fail(e.message);
  }
};

export default {
  command: 'template <folderName>',
  describe: '复制一个文件夹模板，并更名',
  builder: {
    path: {
      description: 'to generate the template',
      required: false,
      alias: 'p',
      default: '.',
      string: true,
    },
    templatePath: {
      description: 'the directory of template folder',
      required: false,
      alias: 'tp',
      default: './template',
      string: true,
    },
  },
  handler: handler as any,
} satisfies CommandModule;
