import glob from './commands/glob';
import init from './commands/init';
import template from './commands/template';

const soonConfig = {
  commands: [init, template, glob],
};
export default soonConfig;
