import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import localforage from 'localforage';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Link from './link';

const MobileMenuHandler = dynamic(() => import('./mobileMenuHandler'), {
    ssr: false,
});

const Nav = dynamic(() => import('./nav'), {
    ssr: false,
    // loading: () => <div style={{ height: '35px ' }} />,
});

const NavMobile = dynamic(() => import('./navMobile'), {
    ssr: false,
});

const RgpdDialog = dynamic(() => import('./rgpdDialog'), {
    ssr: false,
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    linkContainer: {
        textAlign: 'center',
    },
    link: {
        textDecoration: 'none',
        textTransform: 'uppercase',
        color: 'initial',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%',
    },
    nav: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#ffc107',
        height: '60px',
        '& > div': {
            display: 'flex',
            '& > *': {
                margin: '0 10px',
            },
        },
    },
    branding: {
        width: 180,
        height: 60,
        fontSize: 35,
        fontWeight: 800,
        color: '#fff',
        lineHeight: '60px',
        textAlign: 'center',
    },
    menuIcon: {
        height: '60px',
        width: '40px',
        color: '#fff',
        cursor: 'pointer',
    },
}));

export default function Header(props) {
    const { router } = props;
    const [isRgpd, setIsRgpd] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleRGPD = () => {
            const isRgpdRoute = ['/', '/marques-voiture'];
            localforage.getItem('isRgpd').then((value) => {
                if (!value) {
                    // if no value in indexeddb proceed to check the route
                    setIsRgpd(!!isRgpdRoute.includes(router.asPath));
                } else {
                    // if isRgpd is set on indexeddb, do not show dialog
                    setIsRgpd(false);
                }
            });
        };
        const handleLocationChange = () => {
            // close mobile navigation
            setIsMobileMenuOpen(false);
        };

        handleRGPD();
        handleLocationChange();
    }, [router.asPath]);
    const handleCloseRgpdDialog = () => {
        setIsRgpd(false);
        localforage.setItem('isRgpd', true);
    };

    const classes = useStyles();

    return (
        <>
            {isRgpd && <RgpdDialog handleCloseRgpdDialog={handleCloseRgpdDialog} />}
            <header>
                <div className={classes.headerTop}>
                    <Link href="/" aria-label="go to homepage">
                        <p className={classes.branding}>soeezAuto</p>
                    </Link>
                    <div>
                        <MobileMenuHandler
                            isMobileMenuOpen={isMobileMenuOpen}
                            setIsMobileMenuOpen={setIsMobileMenuOpen}
                        />
                    </div>
                </div>
                <Nav />
                <NavMobile isMobileMenuOpen={isMobileMenuOpen} />
            </header>
        </>
    );
}

Header.propTypes = {
    router: PropTypes.object.isRequired,
};
