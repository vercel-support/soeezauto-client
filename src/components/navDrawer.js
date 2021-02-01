import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Drawer,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import PropTypes from 'prop-types';
import styles from 'styles/nav.module.scss';
import { urlWriter } from 'tools/functions';
import Link from './link';

export default function NavDrawer(props) {
    const { open, categories } = props;
    const [currentParent, setCurrentParent] = useState(categories[0]);
    const drawerWidth = 240;

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            position: 'absolute',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            height: 'auto',
            top: '20px',
            left: '20px',
            position: 'absolute',
            overflow: 'initial',
            paddingBottom: '30px',
            border: 'initial',
        },
        subDrawerPaper: {
            width: drawerWidth,
            height: '100%',
            left: '240px',
            position: 'absolute',
            overflow: 'initial',
            paddingBottom: '30px',
            borderRadius: 'unset',
            border: 'initial',
            boxShadow: 'none',
        },
    }));
    const classes = useStyles();

    const handleCategorySelect = (cat) => {
        setCurrentParent(cat);
        const listItems = document.querySelectorAll('#parentDrawer nav');
        listItems.forEach((item) => {
            item.classList.remove('activeNav');
        });
        document.getElementById(cat.id).classList.add('activeNav');
    };
    if (categories) {
        return (
            <div className={classes.root}>
                <Drawer
                    id="parentDrawer"
                    className={classes.drawer}
                    variant="persistent"
                    open={open}
                    transitionDuration={5}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <List>
                        {categories.map((cat) => (
                            <ListItem
                                className={styles.navLi}
                                id={cat.id}
                                component="nav"
                                key={cat.id}
                                onMouseEnter={() => handleCategorySelect(cat)}
                            >
                                <Link href={`/votes/br/${urlWriter(cat.title)}`}>
                                    <ListItemText primary={cat.title} />
                                </Link>
                                <ListItemIcon>
                                    <NavigateNext />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                    <Paper
                        id={`subDrawer-${currentParent.id}`}
                        className={classes.subDrawerPaper}
                    >
                        <List>
                            {currentParent.children.map((cat) => (
                                <ListItem
                                    component="nav"
                                    key={cat.id}
                                    className={styles.navLi}
                                >
                                    <Link
                                        href={`/votes/br/${urlWriter(
                                            currentParent.title,
                                        )}/${urlWriter(cat.title)}`}
                                    >
                                        <ListItemText primary={cat.title} />
                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Drawer>
            </div>
        );
    }
    return null;
}

NavDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
};
