# [JITI](https://github.com/unjs/jiti)

> A Runtime Typescript and ESM support for Node.js

## How to use

### using cli

```bash
jiti index.ts
# or npx jiti index.ts
```

### Register require hook

```bash
node -r jiti/register index.ts
```

### register jiti as a require hook programmatically

```javascript
const jiti = require("jiti")();
const unregister = jiti.register();
```

### programmatically

```javascript
const jiti = require("jiti")(__filename, { debug: true });
```

using the way above you can use jiti to run you code. But how jiti do behind we run our code
that not `cjs` or `mjs`.

### mini-jiti

```javascript
const createRequire = require("create-require")
const { extname, dirname } = require("path")
const { readFileSync } = require("fs")
const babel = require("@babel/core")
const vm = require("vm")
const { Module } = require("module")

const createJITI = (__filename) => {
  const nativeRequire = createRequire(__filename || process.cwd())

  // jiti 需要执行的文件名
  return function jiti(id, parentModule) {
    const filename = nativeRequire.resolve(id)
    const ext = extname(filename)

    if (ext === ".json") {
      const jsonModule = nativeRequire(id)
      Object.defineProperty(jsonModule, "default", { value: jsonModule })
      return jsonModule
    }
    const source = readFileSync(filename, "utf8")
    return evalModule(source, { filename, id, ext, caches: {} })

    function evalModule(source, options = {}) {
      const id = options.id
      const filename = options.filename
      const ext = options.ext
      const cache = {}

      const isTypescript = ext === ".ts" || ext === ".mts" || ext === ".cts"
      const isNativeModule = ext === ".mjs"
      const isCommonJS = ext === ".cjs"
      const needsTranspile = !isCommonJS && (isTypescript || isNativeModule)

      source = transform(source, filename)
      const mod = new Module(filename)
      mod.filename = filename
      if (parentModule) {
        mod.parent = parentModule
        if (
          Array.isArray(parentModule.children) &&
          !parentModule.children.includes(mod)
        ) {
          parentModule.children.push(mod)
        }
      }
      mod.require = createJITI(filename, mod)
      mod.path = dirname(filename)
      mod.paths = Module._nodeModulePaths(mod.path)
      nativeRequire.cache[filename] = mod

      const compiled = vm.runInThisContext(Module.wrap(source))
      compiled(
        mod.exports,
        mod.require,
        mod,
        mod.filename,
        dirname(mod.filename)
      )
      mod.loaded = true
      return mod.exports;
    }
  }
}

module.exports = { createJITI }

function transform(code, filename) {
  const output = babel.transformSync(code, {
    presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: 'commonjs' }]],
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    filename,
  })
  return output.code
}

```
