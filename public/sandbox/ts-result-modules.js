
const version = '0.3.1';
const tsResultModules = [
  { 
    name: "@cardellini/ts-result",
    pattern: /^@cardellini\/ts-result(\/(?!fn).+)?$/,
    types: `https://cdn.jsdelivr.net/npm/@cardellini/ts-result@${version}/dist/result.d.ts`,
    lib: `https://cdn.jsdelivr.net/npm/@cardellini/ts-result@${version}/dist/result.min.js`,
    libName: 'Result',
    module: null,
  },
  { name: "@cardellini/ts-result/fn",
    pattern: /^@cardellini\/ts-result\/fn$/,
    types: `https://cdn.jsdelivr.net/npm/@cardellini/ts-result@${version}/dist/fn.d.ts`,
    lib: `https://cdn.jsdelivr.net/npm/@cardellini/ts-result@${version}/dist/fn.min.js`,
    libName: 'ResultFn',
    module: null,
  }
];

const moduleLoader = (moduleInfo) => fetch(moduleInfo.lib)
  .then(response => response.text())
  .then(lib => {
    const scope = { define: undefined };
    const moduleFn = new Function('scope', `with (scope) { ${lib} }`);
    moduleFn(scope);
    moduleInfo.module = window[moduleInfo.libName];
  })
  .catch(console.error);

const typeLoader = (moduleInfo) => fetch(moduleInfo.types)
  .then(response => response.text())
  .then(types => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      types,
      moduleInfo.name,
    );
    return moduleInfo;
  });

function decorateRequire(_require) {
  return function (moduleName) {
    const tsResultModule = tsResultModules
      .find(moduleInfo =>  moduleInfo.pattern.test(moduleName));

    if (tsResultModule) {
      return tsResultModule.module;
    }

    if (typeof _require === 'function') {
      return _require.apply(this, arguments);
    }

    return undefined;
  }

}
function loadModules() {
  return Promise.all(tsResultModules.map(moduleLoader));
}

function loadTypes() {
  return Promise.all(tsResultModules.map(typeLoader));
}

function loadAll() {
  return Promise.all(tsResultModules.map(
    moduleInfo => Promise.all([moduleLoader(moduleInfo), typeLoader(moduleInfo)])
  ));
}