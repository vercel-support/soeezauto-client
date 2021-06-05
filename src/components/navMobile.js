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
                            Accueil
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/marques-voiture" isActivable>
                            Marques
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/modeles-voiture" isActivable>
                            Modèles
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/segments-automobile" isActivable>
                            Segments
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/prix-budget-voiture" isActivable>
                            Prix & budget
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/promotion-voiture-neuve-au-maroc" isActivable>
                            Promotions
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/soeez-blog" isActivable>
                            Blog
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/comparateur-voiture" isActivable>
                            Comparateur
                        </Link>
                    </ListItem>
                    <ListItem disableGutters id="/">
                        <Link href="/fiches-techniques" isActivable>
                            Fiches techniques
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
