const { getLoader } = require("react-app-rewired");

module.exports = function override(config, env) {
    const tsloader = getLoader(
        config.module.rules,
        rule => String(rule.test) == String(/\.(ts|tsx)$/)
    );
    tsloader.options.compilerOptions = Object.assign({ noUnusedLocals: false }, tsloader.options.compilerOptions)
    config.module.noParse = [/moment.js/]
    const tsconfig = config.plugins.find(item => item.tsconfig)
    tsconfig.options.tsconfig = __dirname + '/tsconfig.base.json'
    tsconfig.tsconfig = __dirname + '/tsconfig.base.json'
    // return console.log(JSON.stringify(config, null, 4))
    return config;
};
