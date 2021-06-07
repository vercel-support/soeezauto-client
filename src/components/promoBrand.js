import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { urlWriter, numberFrance } from 'tools/functions';
import Link from 'components/link';

const useStyles = makeStyles({
    root: {
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    h2: {
        fontSize: '1rem',
        hyphens: 'none',
    },
    /*
    brandContainer: {
        '& > div:not(:first-child)': {
            contentVisibility: 'hidden',
        },
    },
    */
    brand: {
        // contentVisibility: 'auto',
        display: 'block',
        backgroundColor: '#ffe082',
        marginBottom: 30,
    },
    brandHidden: {
        // contentVisibility: 'hidden',
        display: 'none',
    },
    cardContent: {
        padding: '8px',
        '& td': {
            fontSize: '.75rem',
        },
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 300px',
            margin: '20px 0',
            display: 'grid',
            gridTemplateRows: '100px auto 100px',
            boxShadow: '4px 9px 14px -1px rgba(255,193,7,0.62)',
        },
    },
    image: {
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        '& >a div:first-child': {
            borderRadius: 10,
        },
    },
    selectBrand: {
        height: 80,
        width: 300,
        margin: '0 auto',
    },
    loadMore: {
        display: 'grid',
        justifyContent: 'center',
    },
});

const PromoBrand = React.forwardRef((props, listItemRef) => {
    const classes = useStyles();
    const { brand, index, handleListItemChange } = props;
    const [current, setCurrent] = useState(null);
    useEffect(() => {
        if (listItemRef.current) {
            setCurrent((prevState) => {
                if (!prevState || prevState !== listItemRef.current) {
                    setCurrent(listItemRef.current);
                    handleListItemChange(listItemRef.current);
                }
            });
        }
    }, [listItemRef]);
    return (
        <div ref={listItemRef} id={index} className={classes.brand}>
            <Box className={classes.image}>
                <Link
                    href={`${
                        process.env.NEXT_PUBLIC_CLIENT_HOST
                    }/marques-voiture/${urlWriter(brand.brand)}`}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                        alt={brand.brand}
                        width="100"
                        height="100"
                        priority={index === 1}
                    />
                </Link>
            </Box>
            <div className={classes.container}>
                {brand.models.map((model) => (
                    <Card key={model.id} className={classes.root}>
                        <CardHeader
                            title={
                                <h2
                                    className={classes.h2}
                                >{`${brand.brand} ${model.model}`}</h2>
                            }
                            avatar={
                                <Link
                                    key={model.model}
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/modeles-voiture/${urlWriter(
                                        brand.brand,
                                    )}/${urlWriter(model.model)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                        alt={`${brand.brand}-${model.model}`}
                                        width="105"
                                        height="70"
                                        priority={index === 1}
                                    />
                                </Link>
                            }
                        />
                        <CardContent className={classes.cardContent}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="50%">Version</TableCell>
                                        <TableCell width="25%">Prix</TableCell>
                                        <TableCell width="25%">Promo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {model.versions.map((version) => (
                                        <TableRow key={version.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/fiches-techniques/${urlWriter(
                                                        brand.brand,
                                                    )}/${urlWriter(model.model)}`}
                                                >
                                                    {version.version}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {numberFrance(
                                                    version.prices[0].price / 1000,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {numberFrance(
                                                    version.prices[0].promo / 1000,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardActions>
                            <Link
                                key={model.model}
                                href={`${
                                    process.env.NEXT_PUBLIC_CLIENT_HOST
                                }/modeles-voiture/${urlWriter(brand.brand)}/${urlWriter(
                                    model.model,
                                )}`}
                            >
                                <Button variant="contained" color="primary" size="small">
                                    Afficher le modèle
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>
    );
});

PromoBrand.propTypes = {
    brand: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleListItemChange: PropTypes.func.isRequired,
};

export default React.memo(PromoBrand);
