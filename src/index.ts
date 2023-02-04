#!/usr/bin/env node
import { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import createYargs from 'yargs';
import { chalk, debug, getLatestVersion, getPkgInfo, info } from '~lib';
import config from '~config';

const yargs = createYargs(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  debug('loaded from', __dirname);

  const { commands } = config;

  yargs.command('$0', 'the default command', () => { }, async () => {
    console.log('this command will be run by default');
    const pkgInfo = getPkgInfo();
    const pkgName = pkgInfo.name;
    const pkgVersion = pkgInfo.version;
    const latestVersion = await getLatestVersion(pkgName);
    if (latestVersion !== pkgVersion) {
      info(
        `可更新版本，${chalk.green(pkgVersion)} -> ${chalk.green(
          latestVersion,
        )} \n执行npm i -g ${pkgName}`,
      );
    }
  });
  commands.forEach((commandObj) => {
    yargs.command(commandObj as any);
  });

  yargs.parse();
}

main();
