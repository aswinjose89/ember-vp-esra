/* globals blanket, module */

var options = {
    modulePrefix: 'wb-ui-esra',
    filter: '//.*wb-ui-esra/.*/',
    antifilter: '//.*(tests|template).*/',
    loaderExclusions: [],
    enableCoverage: true,
    cliOptions: {
        reporters: ['json'],
        autostart: true
    }
};
if (typeof exports === 'undefined') {
    blanket.options(options);
} else {
    module.exports = options;
}
