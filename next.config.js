// eslint-disable-next-line import/no-extraneous-dependencies
const { createSecureHeaders } = require('next-secure-headers');
// const withPlugins = require('next-compose-plugins');

module.exports = {
    async headers() {
        return [{ source: '/(.*)', headers: createSecureHeaders() }];
    },
    images: {
        domains: ['soeezauto-api', 'localhost'],
    },
};
