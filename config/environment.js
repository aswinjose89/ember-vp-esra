/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'wb-ui-esra',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            defaultRoute: 'index',
            name: 'wb-ui-esra'
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

    }

    ENV.contentSecurityPolicy = {
        'default-src': "'none'",
        'script-src': "'self' * 'unsafe-eval'", // Allow scripts from https://cdn.mxpnl.com
        'font-src': "'self' *", // Allow fonts to be loaded from http://fonts.gstatic.com
        'connect-src': "'self' *", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
        'img-src': "'self' *",
        'style-src': "'self' 'unsafe-inline' *", // Allow inline styles and loaded CSS from http://fonts.googleapis.com
        'media-src': "'self' *"
    };

    ENV['wb-push-config'] = {
        enabled: false,
        socketConfig: {
            url: 'http://localhost:4211',
            connectionConfig: {
                path: '/nodejs/wb-push-notification',
                transports: ['websocket', 'polling']
            }
        }
    }
    return ENV;
};
