"use strict";

const path = require('path');

module.exports = {
    'lang': {
        locales: ['en', 'es', 'ca'],
        defaultLocale: 'es',
        retryInDefaultLocale: true,
        cookie: 'langCookie',
        queryParameter: 'lang',
        directory: path.join(__basedir, 'locales')
    }
};