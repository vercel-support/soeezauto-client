import React from 'react';
import { Typography, Breadcrumbs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowRight, Home } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Link from './link';

const useStyles = makeStyles(() => ({
    breadcrumb: {
        fontSize: 'clamp(.75rem, 13px, 15px)',
        fontWeight: 600,
        '& li': {
            padding: '6px 0',
        },
        '& p': {
            fontSize: 'clamp(.75rem, 13px, 15px)',
            fontWeight: 500,
        },
    },
}));

const Breadcrumb = ({ links }) => {
    const classes = useStyles();

    return (
        <Breadcrumbs
            separator={<KeyboardArrowRight fontSize="small" />}
            aria-label="breadcrumb"
            className={classes.breadcrumb}
        >
            <Link color="inherit" href="/" as="/">
                <Home fontSize="small" />
            </Link>

            {links.map((link) => {
                if (link.href) {
                    return (
                        <Link
                            key={link.href}
                            color="inherit"
                            href={link.href}
                            as={link.as}
                        >
                            {link.text}
                        </Link>
                    );
                }
                return (
                    <Typography key={link.text} color="textPrimary">
                        {link.text}
                    </Typography>
                );
            })}
        </Breadcrumbs>
    );
};

Breadcrumb.propTypes = {
    links: PropTypes.array.isRequired,
};

export default Breadcrumb;
