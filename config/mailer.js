"use strict";

const conf = require('conf');

module.exports = {
    config: {
        from: conf.mailFrom,
        host: conf.mailHost, // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: conf.mailUser,
            pass: conf.mailPassword
        }
    }
};