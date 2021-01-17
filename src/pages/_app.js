/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withReduxSaga from 'next-redux-saga';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from 'components/layout';
import Loading from 'components/loading';
import wrapper from 'store/reduxWrapper';
import theme from 'styles/theme';
// eslint-disable-next-line no-unused-vars
import 'styles/globals.css';

export function reportWebVitals(metric) {
    if (metric.label === 'web-vital') {
        console.log(metric); // The metric object ({ id, name, startTime, value, label }) is logged to the console
    }
}

function MyApp(props) {
    const { Component, pageProps } = props;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    useEffect(() => {
        const handleRouteChangeStart = () => {
            setIsLoading(true);
        };
        const handleRouteChangeComplete = () => {
            setIsLoading(false);
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout>
                    <Component {...pageProps} />
                    {isLoading ? <Loading /> : null}
                </Layout>
            </ThemeProvider>
        </>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};

export default wrapper.withRedux(withReduxSaga(MyApp));
