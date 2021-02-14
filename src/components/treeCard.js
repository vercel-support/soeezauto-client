import React from 'react';
import Image from 'next/image';
import {
    Card,
    CardActions,
    CardContent,
    GridListTile,
    GridListTileBar,
    Typography,
} from '@material-ui/core';
import { ArrowRight, ArrowDropDown } from '@material-ui/icons/';
import { TreeView, TreeItem } from '@material-ui/lab/';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: '20px',
    },
    horizontal: {
        display: 'flex',
    },
    vertical: {
        display: 'grid',
        gridTemplateRows: '180px 1fr',
        // height: '100%',
        padding: 0,
    },
    list: {
        display: 'grid',
        justifyContent: 'space-between',
        gridTemplateRows: '70% 30%',
        '& li': {
            display: 'initial',
            '& >div': {
                height: '100%',
                display: 'grid',
                gridTemplateRows: '60% 40%',
                justifyContent: 'space-between',
            },
        },
    },
    link: {
        width: '100%',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
    },
    imgHolder: {
        width: '180px',
        height: '180px',
        margin: '0 auto',
        '& .MuiBox-root': {
            paddingTop: '36px',
        },
        '& a': {
            display: 'grid',
            justifyContent: 'center',
            marginTop: '20px',
        },
        [theme.breakpoints.down('xs')]: {
            margin: '20px auto',
        },
    },
    MuiGridListTileBar: {
        textTransform: 'uppercase',
        borderRadius: '5px',
        '& > div': {
            fontWeight: '700',
            fontSize: '.9rem',
        },
    },
}));

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
        textTransform: 'uppercase',
        marginLeft: '15px',
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const {
        labelText,
        labelIcon: LabelIcon,
        labelInfo,
        color,
        bgColor,
        ...other
    } = props;

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <LabelIcon color="inherit" className={classes.labelIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

const TreeCard = ({ item, node }) => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent className={classes.vertical}>
                <GridListTile component="div" className={classes.imgHolder}>
                    <Link
                        href={`${
                            process.env.NEXT_PUBLIC_CLIENT_HOST
                        }/marques-voiture/${urlWriter(item.brand)}`}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${item.image}`}
                            alt={item.brand}
                            width="100"
                            height="100"
                            loading="eager"
                            priority
                        />
                    </Link>
                    <GridListTileBar
                        title={item.brand}
                        className={classes.MuiGridListTileBar}
                    />
                </GridListTile>
            </CardContent>
            <CardActions>
                <TreeView
                    className={classes.root}
                    // defaultExpanded={['1']}
                    defaultCollapseIcon={<ArrowDropDown />}
                    defaultExpandIcon={<ArrowRight />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                >
                    <StyledTreeItem
                        nodeId={`${node}`}
                        labelText={`${item.models.length} Modeles`}
                        labelIcon={() => null}
                    >
                        {item.models.map((child) => (
                            <Link
                                key={child.id}
                                href={`/modeles-voiture/${urlWriter(
                                    item.brand,
                                )}/${urlWriter(child.model)}`}
                            >
                                <StyledTreeItem
                                    nodeId={child.id}
                                    labelText={child.model}
                                    labelIcon={() => (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${child.images[0].filename}`}
                                            alt={child.model}
                                            width="90"
                                            height="60"
                                            loading="eager"
                                            priority
                                        />
                                    )}
                                    // labelInfo="90"
                                    color="#1a73e8"
                                    bgColor="#e8f0fe"
                                />
                            </Link>
                        ))}
                    </StyledTreeItem>
                </TreeView>
            </CardActions>
        </Card>
    );
};

TreeCard.propTypes = {
    item: PropTypes.object.isRequired,
    node: PropTypes.number,
};

export default TreeCard;
