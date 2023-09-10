> The simplest and fastest way to bundle your TypeScript libraries. powered by esbuild


## how to use 

### use cli

```bash
tsup [...files]
tsup src/index.ts src/cli.ts # multiple files
```

### use config file

- tsup.config.ts
- tsup.config.js
- tsup.config.cjs
- tsup.config.json
- ...
#### example

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})

```
or
```json
{
  "tsup": {
    "entry": ["src/index.ts"],
    "splitting": false,
    "sourcemap": true,
    "clean": true
  },
  "scripts": {
    "build": "tsup"
  }
}
```

more info about tsup on [tsup](https://tsup.egoist.dev/)

> Above we just introduce what's tsup and how to use it. Next we will introduce how tsup make about function achieved



## The implement of tsup

The main entry is on `src/index.ts`

```javascript
export async function build(_options) {
 // ...
}
```
this function will run to main sub function. One is `dtsTask` and other is `mainTasks`.  dtsTask is used to generate dts file. mainTasks is use to minify, bundle, transform files.

```javascript
// mainTasks function
Promise.all([
	...options.format.map(async(format, index) => {
	
		const pluginContainer = new PluginContainer([
		
			shebang(),
			...(options.plugins || []),
			treeShakingPlugin({
				treeshake: options.treeshake,
				name: options.globalName,
				silent: options.silent
			}),
			cjsColitting(),
			cjsInterop(),
			es5(),
			sizeReporter(),
			terserPlugin({})
		])
		await runEsbuild(options, {
			pluginContainer,
			format,
			css: index === 0 || options.injectStyle? css: undefined;
			logger,
			buildDependencies
		})
	})
])

```
this is a core code of the mainTasks.

```javascript
// PluginContainer



```