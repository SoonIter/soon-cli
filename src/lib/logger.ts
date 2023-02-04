import chalk from 'chalk';

export const success = (text?: string) => {
  console.log(`🎉 ${chalk.green(`${text}\n`)}`);
};

export const fail = (text?: string) => {
  console.log(`❌ ${chalk.red(`${text}\n`)}`);
};

export const warn = (text: string) => {
  console.log(chalk.yellow(`${text}`));
};

export const info = (text: string) => {
  console.log(chalk.cyan(`${text}`));
};
