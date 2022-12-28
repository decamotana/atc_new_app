const mix = require("laravel-mix");
const moment = require("moment");
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react("resources/js/app.js", "public/js")
    .sass("resources/sass/app.scss", "public/css")
    .webpackConfig({
        output: {
            publicPath: "/",
            chunkFilename: "js/[name].[chunkhash].js?v=" + moment().unix()
        }
    });
// mix.react("public/*.js", "public");

mix.version();
if (mix.inProduction()) {
    mix.version();
}
