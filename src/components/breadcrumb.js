import React from 'react';
import { Typography, Breadcrumbs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from './link';

const useStyles = makeStyles(() => ({
    breadcrumb: {
        fontSize: 'clamp(.75rem, 13px, 15px)',
        '& p': {
            fontSize: 'clamp(.75rem, 13px, 15px)',
        },
    },
}));

const Breadcrumb = ({ links }) => {
    const classes = useStyles();

    return (
        <Breadcrumbs separator="›" aria-label="breadcrumb" className={classes.breadcrumb}>
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
