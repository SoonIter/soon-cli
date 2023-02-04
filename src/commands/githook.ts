import { join, resolve } from 'path';
import fg from 'fast-glob';
import type { CommandModule } from 'yargs';
import { exists } from 'fs-extra';
import { cwd as CWD, chalk, execa, fail, fs, success } from '~lib';

const dependencies: string[] = ['simple-git-hooks', 'lint-staged', '@commitlint/cli', '@commitlint/config-conventional', 'eslint'];
const config = JSON.parse(`{ 
  "simple-git-hooks": {
    "pre-commit": "./node_modules/.bin/lint-staged",
    "commit-msg": "./node_modules/.bin/commitlint -e $HUSKY_GIT_PARAMS"
  },
  "lint-staged": {
    "*.{js,ts,tsx,vue,md}": [
      "eslint --fix"
    ]
  }
}`);

const handler = async (args: { path: string }) => {
  const { path } = args;
  const cwd = resolve(CWD, path);
  const packageJsonPath = join(cwd, './package.json');

  if (!await exists(packageJsonPath)) {
    fail(`Please make sure that the package.json exists at ${packageJsonPath}`);
    return;
  }

  try {
    const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf8');
    console.log('loaded from ', chalk.green(packageJsonPath));

    const packageJsonObj = JSON.parse(packageJsonRaw);

    for (const attr in config) {
      if (!packageJsonObj[attr])
        packageJsonObj[attr] = config[attr];
    }

    if (!packageJsonObj.scripts)
      packageJsonObj.scripts = {};

    Object.assign(packageJsonObj.scripts, { prepare: 'simple-git-hooks' });
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJsonObj, undefined, 2));

    const haveCommitlint = await fg('./*commitlint*', { dot: true, cwd });
    if (haveCommitlint.length === 0)
      await fs.writeFile(join(cwd, '.commitlintrc'), '{ \"extends\": [\"@commitlint/config-conventional\"] }');

    const commandRunning = `pnpm add -Dw ${dependencies.join(' ')}`;
    console.log(chalk.yellow(commandRunning));
    await execa(commandRunning, { stdio: 'inherit' });

    success('添加完成');
  }
  catch (e) {
    console.log(chalk.red(e));
  }
};

export default {
  command: 'githook',
  describe: 'automatically config the simple-git-hooks',
  builder: {
    path: {
      description: 'the directory of package.json that add simple-git-hook',
      required: false,
      alias: 'p',
      default: '.',
      string: true,
    },
  },
  handler: handler as any,
} satisfies CommandModule;
