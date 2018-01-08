/// <binding />
const devConfig = require('./Config/webpack.dev');
const prodConfig = require('./Config/webpack.prod');
const isDevBuild = process.argv.indexOf('--env.prod') < 0;



console.log("==========Is Dev Build = " + isDevBuild + " ============")


module.exports = isDevBuild ? devConfig : prodConfig;