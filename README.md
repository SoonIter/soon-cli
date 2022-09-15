# soon-cli

## start

```shell
> ni -g soon-cli
  or pnpm i -g soon-cli
> soon init <project-name>
```

`npx soon init <project-name>`.

## commands

### init

`npx soon init <project-name>`.
replace the `[name]` to `<project-name>`

![init preview](https://raw.githubusercontent.com/SoonIter/soon-cli/master/docs/init.png)

### template

`npx soon template <dir-name>`

copy './template' to './\<dir-name\>', and replace the `[name]` to `<dir-name>`

![template preview](https://raw.githubusercontent.com/SoonIter/soon-cli/master/docs/template.png)


### glob

`npx soon glob <path>`

generate 'export \* from \<path\>' to index.ts

e.g: When build your hooks  `soon glob ./use*/index.{ts,tsx} ./create*/index.{ts,tsx}`

```typescript
export * from './useBoolean/index';
export * from './useCounter/index';
export * from './useEventListener/index';
export * from './useLocalStorage/index';
export * from './useModelValue/index';
export * from './useMouse/index';
export * from './useTitle/index';
export * from './useToggle/index';
export * from './createMotionTransform/index';
```

### My Owesome Templates

- [sooniter-lib-template-monorepo](https://github.com/SoonIter/sooniter-lib-template-monorepo) - my template of monorepo project with pnpm and vitest
- [sooniter-lib-template](https://github.com/SoonIter/sooniter-lib-template) - my template to create npm libraries with vitest
- [tampermonkey-svelte-template](https://github.com/SoonIter/tampermonkey-svelte-template) - A template with Svelte + TS + Unocss + Vite to build UI within shadow-root.
- [sooniter-react-template](https://github.com/SoonIter/sooniter-react-template) - My react template with semi-design,vite,unocss,unplugin-auto-import and vitest.
- [solid-vite-unocss-template](https://github.com/SoonIter/solid-vite-unocss-template) - A template of solid + vite + unocss.
