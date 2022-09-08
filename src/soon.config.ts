import chalk from 'chalk';
import glob from './commands/glob';
import init from './commands/init';
import template from './commands/template';

const soonConfig = {
  commands: [init, template, glob],
  templates: [
    {
      name: 'React + Vite + Unocss',
      degit: 'SoonIter/sooniter-react-template',
    },
    {
      name: 'Solid + Vite + Unocss',
      degit: 'SoonIter/solid-vite-unocss-template',
    },
    {
      name: 'Solid + Monorepo',
      degit: 'SoonIter/solid-monorepo-template',
    },
    {
      name: 'Svelte + Vite + Unocss',
      degit: 'SoonIter/tampermonkey-svelte-template',
    },
    {
      name: 'lib + Vitest',
      degit: 'SoonIter/sooniter-lib-template',
    },
    {
      name: 'lib + Vitest + monorepo',
      degit: 'SoonIter/sooniter-lib-template-monorepo',
    },
  ],
  templateColor: [] as const,
};
export default soonConfig;
