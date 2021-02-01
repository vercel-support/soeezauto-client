import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuOpen } from '@material-ui/icons';
import { isMobile } from 'react-device-detect';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    menuIcon: {
        height: '60px',
        width: '40px',
        color: '#fff',
        cursor: 'pointer',
    },
}));

export default function MobileMenuHandler(props) {
    const { isMobileMenuOpen, setIsMobileMenuOpen } = props;
    const classes = useStyles();
    return (
        <>
            {isMobile && !isMobileMenuOpen ? (
                <Menu
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={classes.menuIcon}
                />
            ) : null}
            {isMobile && isMobileMenuOpen ? (
                <MenuOpen
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={classes.menuIcon}
                />
            ) : null}
        </>
    );
}

MobileMenuHandler.propTypes = {
    isMobileMenuOpen: PropTypes.bool.isRequired,
    setIsMobileMenuOpen: PropTypes.func.isRequired,
};
