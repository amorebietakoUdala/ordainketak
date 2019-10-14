var Encore = require('@symfony/webpack-encore');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
// directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/ordainketak/build/')
    // only needed for CDN's or sub-directory deploy
    .setManifestKeyPrefix('build/')
    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')
    .addEntry('receipt_list', './assets/js/receipt/list.js')
    .addEntry('exam_new', './assets/js/exam/new.js')
	.addEntry('concept_list', './assets/js/concept/list.js')
	.addEntry('concept_new', './assets/js/concept/new.js')
	.addEntry('concept_edit', './assets/js/concept/edit.js')
	.addEntry('category_list', './assets/js/category/list.js')
	.addEntry('category_new', './assets/js/category/new.js')
	.addEntry('category_edit', './assets/js/category/edit.js')
	.addEntry('activity_list', './assets/js/activity/list.js')
	.addEntry('activity_new', './assets/js/activity/new.js')
	.addEntry('activity_edit', './assets/js/activity/edit.js')
	.addEntry('tickets_buy', './assets/js/tickets/buy.js')
// When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
.splitEntryChunks()

// will require an extra script tag for runtime.js
// but, you probably want this, unless you're building a single-page app
.enableSingleRuntimeChunk()
    // .disableSingleRuntimeChunk()

/*
 * FEATURE CONFIG
 *
 * Enable & configure other features below. For a full
 * list of features, see:
 * https://symfony.com/doc/current/frontend.html#adding-more-features
 */
.cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

// enables @babel/preset-env polyfills
.configureBabel(() => {}, {
    useBuiltIns: 'usage',
    corejs: 3,
    includeNodeModules: [
        //			"es.promise", "es.array.iterator"
    ]
})

// enables Sass/SCSS support
.enableSassLoader()
    //.enablePostCssLoader()

// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment to get integrity="..." attributes on your script & link tags
// requires WebpackEncoreBundle 1.4 or higher
//.enableIntegrityHashes()

// uncomment if you're having problems with a jQuery plugin
// Needed bay bootstrap-table
.autoProvidejQuery()

// uncomment if you use API Platform Admin (composer req api-admin)
//.enableReactPreset()
//.addEntry('admin', './assets/js/admin.js')

.copyFiles({
    from: './assets/images',
    to: 'images/[path][name].[hash:8].[ext]'
})

;

module.exports = Encore.getWebpackConfig();