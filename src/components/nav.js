import React from 'react';
import { MenuList, MenuItem } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import { isBrowser } from 'react-device-detect';
// import PropTypes from 'prop-types';
import styles from 'styles/nav.module.scss';
import Link from './link';

const Nav = () => {
    return (
        <>
            {isBrowser && (
                <MenuList className={styles.navGrid} style={{ padding: '0 10px 0 0' }}>
                    <MenuItem disableGutters id="/">
                        <Link href="/" isActivable>
                            <Home />
                        </Link>
                    </MenuItem>
                    <MenuItem disableGutters id="/">
                        <Link href="/marques-voiture" isActivable>
                            Marques
                        </Link>
                    </MenuItem>
                </MenuList>
            )}
        </>
    );
};

Nav.propTypes = {};

export default Nav;
