import { join } from 'path';
import { execSync } from 'child_process';
import fg from 'fast-glob';
import { chalk, cwd, fs, success } from '~lib';

const config = JSON.parse(`{ 
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged",
    "commit-msg": "npx commitlint -e $HUSKY_GIT_PARAMS"
  },
  "lint-staged": {
    "*.{js,ts,tsx,vue,md}": [
      "eslint --fix"
    ]
  }
}`);

const handler = async () => {
  const res = fs.existsSync('./package.json');

  if (!res) {
    console.log(chalk.red('没有package.json，请检查目录'));
    return;
  }

  const packageJsonUrl = join(cwd, './package.json');
  const packageJson = fs.readFileSync(packageJsonUrl, 'utf8');
  console.log('修改的项目：', chalk.green(packageJsonUrl));

  try {
    const packageJsonObj = JSON.parse(packageJson);
    const dependencies: string[] = ['simple-git-hooks', 'lint-staged', '@commitlint/cli', '@commitlint/config-conventional', 'eslint'];
    for (const attr in config) {
      if (!packageJsonObj[attr])
        packageJsonObj[attr] = config[attr];
    }
    if (!packageJsonObj.scripts)
      packageJsonObj.scripts = {};

    Object.assign(packageJsonObj.scripts, { prepare: 'simple-git-hooks' });
    fs.writeFileSync(packageJsonUrl, JSON.stringify(packageJsonObj, undefined, 2));

    const haveCommitlint = await fg('./*commitlint*');
    if (haveCommitlint.length === 0)
      fs.writeFileSync('.commitlintrc', '{ extends: [\'@commitlint/config-conventional\'] };');

    const commandRunning = `pnpm install -Dw ${dependencies.join(' ')}`;
    console.log(chalk.yellow(commandRunning));
    execSync(commandRunning, { stdio: 'inherit' });

    success('添加完成');
  }
  catch (e) {
    console.log(chalk.red(e));
  }
};

export default {
  command: 'githook',
  desc: '自动配置simple-git-hooks',
  handler,
};
