// eslint-disable-next-line import/no-extraneous-dependencies
const { createSecureHeaders } = require('next-secure-headers');
// const withPlugins = require('next-compose-plugins');

module.exports = {
    async headers() {
        return [{ source: '/(.*)', headers: createSecureHeaders() }];
    },
    /*
    async redirects() {
        // console.log('source', '/marques-voiture/:brand(\b([A-Z])(w+))');
        // console.log('destination', '/marques-voiture/:(l$1$2)');
        return [
            {
                source: '/marques-voiture/:brand([A-Za-z].*)',
                destination: `/marques-voiture/:${brand.toLowerCase()}`,
                permanent: false,
            },
        ];
    },
    */
    images: {
        domains: ['soeezauto-api', 'localhost', 'www.soeezauto.com'],
    },
    crossOrigin: 'anonymous',
};
