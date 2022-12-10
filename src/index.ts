#!/usr/bin/env node
import path, { dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { program } from 'commander';
import pacote from 'pacote';
import { chalk, error, fs, info } from './lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let pkgVersion = '';
let pkgName = '';

// 获取当前包的信息
const getPkgInfo = () => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const jsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
  const jsonResult = JSON.parse(jsonContent);
  pkgVersion = jsonResult.version;
  pkgName = jsonResult.name;
};

// 获取最新包最新版本
const getLatestVersion = async () => {
  const manifest = await pacote.manifest(`${pkgName}@latest`);
  return manifest.version;
};

async function start() {
  // 加载commands从 `./soon.config.t/js`
  const commandsPath = (await (
    (
      await import('./soon.config.js')
    ).default as any
  ).commands) as unknown as ICommand[];
  commandsPath.forEach(async (commandObj) => {
    const { command, description, optionList, action } = commandObj;
    const curp = program
      .command(command)
      .description(description)
      .action(action);

    optionList
      && optionList.forEach((option: [string, string]) => {
        curp.option(...option);
      });
  });

  getPkgInfo();
  program.version(pkgVersion);

  program.on('command:*', async ([cmd]) => {
    program.outputHelp();
    error(`未知命令 command ${chalk.yellow(cmd)}.`);
    const latestVersion = await getLatestVersion();
    if (latestVersion !== pkgVersion) {
      info(
        `可更新版本，${chalk.green(pkgVersion)} -> ${chalk.green(
          latestVersion,
        )} \n执行npm i -g ${pkgName}`,
      );
    }
    process.exitCode = 1;
  });

  program.parseAsync(process.argv);
}

start();
