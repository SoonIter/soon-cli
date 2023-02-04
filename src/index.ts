#!/usr/bin/env node
import { dirname } from 'path';
import { fileURLToPath } from 'node:url';
import createYargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { chalk, debug, getLatestVersion, getPkgInfo } from '~lib';
import config from '~config';

console.log(111);
const yargs = createYargs(hideBin(process.argv));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  debug('loaded from', __dirname);
  const { commands } = config;

  yargs.scriptName('soon');
  yargs.command('$0', 'the default command', (yargsInstance) => {
  }, async () => {
    console.log(`loaded from ${__dirname}`);
    const pkgInfo = getPkgInfo();
    const pkgName = pkgInfo.name;
    const pkgVersion = pkgInfo.version;
    const latestVersion = await getLatestVersion(pkgName);
    if (latestVersion !== pkgVersion) {
      console.log(
        `Latest version available: ${chalk.green(pkgVersion)} -> ${chalk.green(
          latestVersion,
        )} \nExecute this to update: ${chalk.cyan(`npm install -g ${pkgName}`)}`,
      );
    }
  });
  yargs.showHelpOnFail(false);
  commands.forEach((commandObj) => {
    yargs.command(commandObj as any);
  });

  yargs.parse();
}

main();
