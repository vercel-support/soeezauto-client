import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import { randIndex, urlWriter } from 'tools/functions';
import Link from 'components/link';

const useStyles = makeStyles({
    root: {
        contentVisibility: 'auto',
        containIntrinsicSize: '275px',
        color: '#29335c',
        backgroundColor: '#ffe082',
        margin: '20px auto',
        width: 'clamp(300px,100%, 600px)',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardContent-root': {
            height: '200px',
            '& img': {
                border: '2px solid #fff',
            },
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            // color: '#fff',
        },
    },
    cardContent: {
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        justifyContent: 'space-evenly',
        rowGap: '6px',
        gridGap: '6px',
        backgroundColor: '#fff',
        margin: '0 5px',
        borderRadius: 6,
        '& >div': {
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
    },
    subtitle: {
        fontSize: '.65rem',
        fontWeight: 'bold',
        position: 'relative',
        top: '-6px',
    },
});

const WidgetLaunches = ({ data }) => {
    const classes = useStyles();
    const [recentModels, setRecentModels] = useState(null);
    useEffect(() => {
        // if data provided is coming from getBrandsModels
        if (data[0].models) {
            const allModels = [];
            data.forEach((brand) => {
                const mods = [...brand.models];
                mods.forEach((mod) => {
                    // eslint-disable-next-line no-param-reassign
                    mod.brand = { brand: brand.brand };
                });
                allModels.push(...mods);
            });
            const sortedModels = allModels.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            const randMod = randIndex(19, 6);
            setRecentModels(
                sortedModels.filter((model, ind) => {
                    return randMod.includes(ind);
                }),
            );
        } else {
            setRecentModels(data);
        }
    }, [data]);
    return (
        <Card className={classes.root}>
            <CardHeader title={<h2>Nouveautés </h2>} />
            <CardContent className={classes.cardContent}>
                {recentModels?.map((model) => (
                    <Box key={model.model}>
                        <Link
                            href={`${
                                process.env.NEXT_PUBLIC_CLIENT_HOST
                            }/modeles-voiture/${urlWriter(model.brand.brand)}/${urlWriter(
                                model.model,
                            )}`}
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                alt={model.model}
                                width="90"
                                height="60"
                                layout="fixed"
                            />
                        </Link>
                        <span
                            className={classes.subtitle}
                        >{`${model.brand.brand} ${model.model}`}</span>
                    </Box>
                ))}
            </CardContent>
            <CardActions />
        </Card>
    );
};

WidgetLaunches.propTypes = {
    data: PropTypes.array.isRequired,
};

export default React.memo(WidgetLaunches);
