import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionAddToUrlHistory } from 'store/actions';
import styles from 'styles/layout.module.scss';
import Header from './header';

const Footer = dynamic(() => import('./footer'), {
    ssr: false,
});

const ClientLog = dynamic(() => import('./clientLog'), {
    ssr: false,
});

const Layout = (props) => {
    const router = useRouter();
    const { children } = props;
    useEffect(() => {
        const handleRouteChangeComplete = (url) => {
            props.actionAddToUrlHistory(url);
        };
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, [router.events]);
    return (
        <div className={styles.container}>
            <div>
                <Header siteTitle="soeezauto.ma" router={router} />
                <>{children}</>
            </div>
            <Footer />
            <ClientLog />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    actionAddToUrlHistory: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionAddToUrlHistory,
        },
        dispatch,
    );
}

export default connect(null, mapDispatchToProps)(Layout);
