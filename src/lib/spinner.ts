import ora from 'ora';

const spinner = ora();

export const startSpinner = (text?: string) => {
  const msg = `${text}...\n`;
  spinner.start(msg);
  spinner.stopAndPersist({
    symbol: '✨',
    text: msg,
  });
};

/**
 * higher-order function that wrap fn with ora progress bar
 * @param fn async or sync function that need a progress
 * @example
 * const add = (a, b) => a + b;
 * await oraWrapper(add, {
 *   text: "move files in infraDir",
 * })(1, 2);
 */
export function withSpinner<This, Args extends unknown[], R>(
  fn: (this: This, ...args: Args) => R,
  options: {
    text: string
    successText?: string
    failText?: string | undefined
  },
): (...args: Args) => Promise<Awaited<R>> {
  const { text, successText, failText } = options;
  return async function (this: This, ...args: Args): Promise<Awaited<R>> {
    const spinner = ora(`${text}...`).start();
    try {
      const result = await fn.apply(this, args);
      spinner.succeed(successText ?? text);
      return result;
    }
    catch (e) {
      spinner.fail(failText ?? text);
      throw e;
    }
  };
}
