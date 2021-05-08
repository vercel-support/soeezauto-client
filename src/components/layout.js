import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import styles from '../styles/layout.module.scss';
import Header from './header';
import ClientLog from './clientLog';

const Footer = dynamic(() => import('./footer'), {});

const Layout = ({ children }) => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div>
                <Header siteTitle="soeezauto.ma" router={router} />
                <ClientLog />
                <>{children}</>
            </div>
            <Footer />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
