
const version = '0.6.3';
const tsResultageModules = [
  { 
    name: "resultage",
    pattern: /^resultage(\/(?!fn).+)?$/,
    types: `https://cdn.jsdelivr.net/npm/resultage@${version}/dist/resultage.d.ts`,
    lib: `https://cdn.jsdelivr.net/npm/resultage@${version}/dist/resultage.min.js`,
    libName: 'Resultage',
    module: null,
  },
  { name: "resultage/fn",
    pattern: /^resultage\/fn$/,
    types: `https://cdn.jsdelivr.net/npm/resultage@${version}/dist/fn.d.ts`,
    lib: `https://cdn.jsdelivr.net/npm/resultage@${version}/dist/fn.min.js`,
    libName: 'Resultage.Fn',
    module: null,
  }
];

const moduleLoader = (moduleInfo) => fetch(moduleInfo.lib)
  .then(response => response.text())
  .then(lib => {
    const scope = { define: undefined };
    const moduleFn = eval(`() => { ${lib};\n return ${moduleInfo.libName}; }`);
    moduleInfo.module = moduleFn(scope);
  })
  .catch(console.error);

const typeLoader = (moduleInfo) => fetch(moduleInfo.types)
  .then(response => response.text())
  .then(types => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "${moduleInfo.name}" {\n${types}\n}`,
      moduleInfo.name,
    );
    return moduleInfo;
  });

function decorateRequire(_require) {
  return function (moduleName) {
    const tsResultageModule = tsResultageModules
      .find(moduleInfo => moduleInfo.pattern.test(moduleName));

    if (tsResultageModule) {
      return tsResultageModule.module;
    }

    if (typeof _require === 'function') {
      return _require.apply(this, arguments);
    }

    return undefined;
  }
}
function loadModules() {
  return Promise.all(tsResultageModules.map(moduleLoader));
}

function loadTypes() {
  return Promise.all(tsResultageModules.map(typeLoader));
}

function loadAll() {
  return Promise.all(tsResultageModules.map(
    moduleInfo => Promise.all([moduleLoader(moduleInfo), typeLoader(moduleInfo)])
  ));
}