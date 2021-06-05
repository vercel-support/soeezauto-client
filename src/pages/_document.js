/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="fr-FR">
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="dns-prefetch" href="https://soeezauto.com" />
                    <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                    <link
                        href="https://fonts.gstatic.com"
                        crossOrigin=""
                        rel="preconnect"
                    />
                    <link
                        rel="preconnect"
                        href="https://soeezauto.com"
                        crossOrigin="true"
                    />
                    <link
                        rel="preload"
                        as="font"
                        type="font/woff"
                        href="/fonts/roboto-v20-latin-700.woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        href="/fonts/roboto-v20-latin-700.woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        type="font/woff"
                        href="/fonts/roboto-v20-latin-700italic.woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        href="/fonts/roboto-v20-latin-700italic.woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        type="font/woff"
                        href="/fonts/roboto-v20-latin-regular.woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        href="/fonts/roboto-v20-latin-regular.woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="192x192"
                        href="/android-chrome-192x192.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="512x512"
                        href="/android-chrome-512x512.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/apple-touch-icon.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon-16x16.png"
                    />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff" />

                    <meta property="og:locale" content="fr_FR" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (WrappedComponent) => (props) =>
                sheets.collect(<WrappedComponent {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            ...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement(),
        ],
    };
};
