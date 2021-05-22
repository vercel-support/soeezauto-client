import React from 'react';
import { List, ListItem, Divider } from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
import styles from 'styles/nav.module.scss';
import Link from './link';

const NavMobile = (props) => {
    const { isMobileMenuOpen } = props;

    return (
        <>
            {isMobile && isMobileMenuOpen && (
                <List className={styles.navMobile}>
                    <ListItem>
                        <Link href="/" isActivable>
                            Home
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/marques-voiture" isActivable>
                            Marques
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/modeles-voiture" isActivable>
                            modeles
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/segments-automobile" isActivable>
                            segments
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/prix-budget-voiture" isActivable>
                            prix
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/promotion-voiture-neuve-au-maroc" isActivable>
                            promotions
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/soeez-blog" isActivable>
                            blog
                        </Link>
                    </ListItem>
                    <Divider />
                </List>
            )}
        </>
    );
};

NavMobile.propTypes = {
    isMobileMenuOpen: PropTypes.bool.isRequired,
};

export default NavMobile;
