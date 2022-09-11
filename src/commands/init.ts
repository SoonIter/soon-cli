import path from 'path';
import inquirer from 'inquirer';
import replaceStringInFiles from 'tiny-replace-files';
import soonConfig from '../soon.config';
import {
  chalk,
  cwd,
  execa,
  failSpinner,
  fs,
  info,
  startSpinner,
  succeedSpiner,
  warn,
} from '../lib/index';

// 检查是否已经存在相同名字工程
const checkProjectExist = async (targetDir) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'checkExist',
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ['覆盖', '取消'],
    });
    if (answer.checkExist === '覆盖') {
      warn(`删除${targetDir}...`);
      fs.removeSync(targetDir);
    }
    else {
      return true;
    }
  }
  return false;
};

let _templates = soonConfig?.templates ?? ([] as ITemplate[]);

const getQuestions = async (projectName = 'my-new-app') => {
  const templates = soonConfig.templates;
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
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `package name: (${projectName})`,
      default: projectName,
    },
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目模版',
      choices: templates.map(i => getSpecialText(i.name)),
      data: templates.map(i => i.degit),
    },
  ]);
};

const cloneProject = async (targetDir, projectName, projectInfo) => {
  startSpinner(`正在创建项目 ${chalk.cyan(targetDir)}`);
  // TODO: 这里上颜色的形式不太好，容易出bug
  const degitUrl
    = _templates.find(i => projectInfo.projectType.includes(i.name))?.degit
    ?? 'none';
  await execa('npx', ['degit', degitUrl, projectName]);
};

const action = async (projectName = 'my-new-app', cmdArgs?: any) => {
  try {
    // 获取项目路径
    const targetDir = path.join(
      (cmdArgs && cmdArgs.context) || cwd,
      projectName,
    );
    if (await checkProjectExist(targetDir)) {
      warn('此路径已存在');
      return;
    }

    // { name: 'hello', projectType: '\x1B[38;2;130;215;247m\x1B[1Solid + Monorepo\x1B[22m\x1B[39m' }
    const projectInfo = await getQuestions(projectName);

    // clone仓库
    await cloneProject(targetDir, projectName, projectInfo);

    // 替换[name]
    const options = {
      files: `${targetDir}/**/*`,
      from: /\[name\]/g,
      to: projectName,
    };
    await replaceStringInFiles(options);
    succeedSpiner(
      `项目创建完成 ${chalk.yellow(projectName)}\n👉 输入以下命令开始使用:`,
    );

    info(`$ cd ./${projectName} \n$ ni or pnpm install\n`);
  }
  catch (err) {
    const e = err as Error;
    failSpinner(e.message);
  }
};

export default {
  command: 'init [project-name]',
  description: '创建一个项目',
  optionList: [['--context <context>', '上下文路径']],
  action,
} as ICommand;

function getSpecialText(templateName: string) {
  const m = [
    ...soonConfig.templateColor,
    [/solid/i, chalk.hex('#4d71b3').bold],
    [/react/i, chalk.hex('#82d7f7').bold],
    [/svelte/i, chalk.hex('#eb5027').bold],
    [/vue/i, chalk.hex('#65b687').bold],
    [/vitest/i, chalk.hex('#7b9a36').bold],
    [/vite/i, chalk.hex('#8e68f6').bold],
    [/unocss/i, chalk.hex('#9a9a9a').bold],
  ] as const;
  const transformColor
    = m.find(([reg]) => reg.test(templateName))?.[1] ?? ((str: string) => str);
  // let name = templateName;
  // console.log('---------', name);
  // m.forEach(([reg, fn]) => {
  //   name = name.replace(reg, sub => fn(sub));
  //   console.log(name);
  // });
  return transformColor(templateName);
}
