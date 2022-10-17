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
      name: 'Vitesse + Vue',
      degit: 'SoonIter/vitesse',
    },
    {
      name: 'Vitesse-lite + Vue',
      degit: 'antfu/vitesse-lite',
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
    {
      name: 'unplugin-starter - Vite',
      degit: 'antfu/unplugin-starter',
    },
    {
      name: 'vscode-starter',
      degit: 'antfu/starter-vscode',
    },
  ],
  templateColor: [] as const,
};
export default soonConfig;
