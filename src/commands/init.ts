import path from 'path';
import type { Choice } from 'prompts';
import prompts from 'prompts';
import { replaceStringInFiles } from 'tiny-replace-files';
import config from '../config';
import {
  chalk,
  debug,
  execa,
  fail,
  fs,
  info,
  success,
  warn,
  withSpinner,
} from '../lib/index';

// 检查是否已经存在相同名字工程
const checkProjectExist = async (targetDir: string) => {
  if (fs.existsSync(targetDir)) {
    const { answer } = await prompts({
      type: 'select',
      name: 'answer',
      message: `仓库路径 ${targetDir} 已存在，请选择`,
      choices: [{ title: '覆盖' }, { title: '取消' }],
    });
    console.log(answer);
    if (answer === 0) {
      await withSpinner(async () => {
        await fs.remove(targetDir);
      }, { text: 'clear the directory...' })();
    }
    else {
      return true;
    }
  }
  return false;
};

let _templates = config?.templates ?? ([] as ITemplate[]);

const askQuestions = async (projectName = 'my-new-app') => {
  const templates = config.templates;
  _templates = templates.map(({ degit, name }) => {
    // degit github:user/repo
    // degit git@github.com:user/repo
    // degit https://github.com/user/repo
    // degit user/repo#dev       # branch
    // degit user/repo#v1.2.3    # release tag
    // degit user/repo#1234abcd  # commit hash
    return {
      degit: degit.startsWith('http') ? degit : `github:${degit}`,
      name,
    };
  });

  const { chosenTemplate, projectName: textedProjectName = projectName } = await prompts([{
    name: 'projectName',
    type: 'text',
    message: `package name: (${projectName})`,
  }, {
    name: 'chosenTemplate',
    message: 'choose a template',
    type: 'autocomplete',
    choices: _templates.map(i => ({ title: getColoredText(i.name), value: i })),
    async suggest(input: string, choices: Choice[]) {
      if (input === '')
        return choices;
      return choices.filter(i => i.value.name.includes(input));
    },
  }]);
  return {
    name: textedProjectName,
    chosenTemplate,
  } as { name: string; chosenTemplate: ITemplate };
};

const cloneProject = async (
  targetDir: string,
  projectName: string,
  degitUrl: string,
) => {
  await withSpinner(async () => await execa('npx', ['degit', degitUrl, projectName]), {
    text: `create the project in ${chalk.green(targetDir)}`,
  })();
};

const handler = async ({ projectName = 'my-new-app' }) => {
  try {
    const projectInfo = await askQuestions(projectName);

    // 获取项目路径
    const targetDir = path.join(
      process.cwd(),
      projectName,
    );

    if (await checkProjectExist(targetDir)) {
      warn('此路径已存在');
      return;
    }

    // clone仓库
    await cloneProject(targetDir, projectName, projectInfo.chosenTemplate.degit);

    // 替换[name]
    const options = {
      files: `${targetDir}/**/*`,
      from: /\[name\]/g,
      to: projectName,
    };
    debug(options);

    await replaceStringInFiles(options);
    success(
      `项目创建完成 ${chalk.yellow(projectName)}\n👉 输入以下命令开始使用:`,
    );

    info(`$ cd ./${projectName} \n$ ni or pnpm install`);
  }
  catch (err) {
    const e = err as Error;
    fail(e.message);
  }
};

function getColoredText(templateName: string) {
  // 根据项目上色
  const m = [
    ...config.templateColor,
    [/solid/i, chalk.hex('#4d71b3').bold],
    [/react/i, chalk.hex('#82d7f7').bold],
    [/svelte/i, chalk.hex('#eb5027').bold],
    [/vue/i, chalk.hex('#65b687').bold],
    [/vitest/i, chalk.hex('#7b9a36').bold],
    [/vite/i, chalk.hex('#8e68f6').bold],
    [/unocss/i, chalk.hex('#9a9a9a').bold],
    [/vscode/i, chalk.hex('#4f88ea').bold],
  ] as const;
  const transformColor
  = m.find(([reg]) => reg.test(templateName))?.[1] ?? ((str: string) => str);
  return transformColor(templateName);
}

export default {
  command: 'init [project-name]',
  desc: '创建一个项目',
  handler,
};
