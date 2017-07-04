/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
    var app, appConfig, fs = require("fs");

    appConfig = JSON.parse(fs.readFileSync('./build-config.json'))[EmberApp.env()];

    app = new EmberApp(defaults, appConfig || {});

    // Shim is required since bind function is not available in phantomjs.
    app.import(app.bowerDirectory + '/es5-shim/es5-shim.js');
    app.import(app.bowerDirectory + '/jquery-mockjax/jquery.mockjax.js', { type: 'test' });

    return app.toTree();
};
