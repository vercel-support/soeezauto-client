import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Box,
    Chip,
    Avatar,
    List,
    ListItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MonetizationOn } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { urlWriter, numberFrance } from 'tools/functions';
import Link from 'components/link';
import { CONVERSION_FUEL } from 'parameters';

const useStyles = makeStyles({
    cards: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        gap: 10,
        '& > div': {
            flex: '0 0 280px',
            // backgroundColor: '#ffe082',
        },
        '& .MuiCardContent-root': {
            padding: 0,
        },
    },
    table: {
        margin: '20px 0',
    },
    fiche: {
        margin: '20px 0',
        '& button': {
            fontWeight: 700,
        },
    },
    ul: {
        display: 'grid',
        justifyContent: 'center',
        '& li': {
            height: 40,
            '& div': {
                width: '100%',
            },
        },
    },
});

const ModelVersions = ({ model }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.cards}>
                {model.versions.map((version) => (
                    <Card key={version.id}>
                        <CardHeader
                            title={
                                <Link
                                    href={`/fiches-techniques/${urlWriter(
                                        model.brand.brand,
                                    )}/${urlWriter(model.model)}`}
                                >
                                    <Button variant="contained" color="primary">
                                        {version.version}
                                    </Button>
                                </Link>
                            }
                        />
                        <CardContent>
                            <List className={classes.ul}>
                                <ListItem className={classes.li}>
                                    {version.prices[0].promo && (
                                        <Chip
                                            size="small"
                                            avatar={
                                                <Avatar>
                                                    <MonetizationOn />
                                                </Avatar>
                                            }
                                            label={`PROMO ${numberFrance(
                                                version.prices[0].promo,
                                            )} DH`}
                                            color="secondary"
                                        />
                                    )}
                                </ListItem>
                                <ListItem>
                                    <Chip
                                        size="small"
                                        label={`Prix:${numberFrance(
                                            version.prices[0].price,
                                        )} DH`}
                                        avatar={
                                            <Avatar>
                                                <MonetizationOn />
                                            </Avatar>
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <Chip
                                        size="small"
                                        label={`Puissance: ${version.motor.power} ch`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Chip
                                        size="small"
                                        label={`Puissance fiscale: ${version.CF.CF}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Chip
                                        size="small"
                                        label={`Combustible: ${
                                            CONVERSION_FUEL[version.motor.fuel]
                                        }`}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {model.specs.edges.length > 0 && (
                <Box className={classes.fiche}>
                    <Link
                        href={`/fiches-techniques/marque/${urlWriter(model.brand.brand)}`}
                    >
                        <Button variant="contained" color="secondary">
                            Fiche technique constructeur
                        </Button>
                    </Link>
                </Box>
            )}
        </>
    );
};

ModelVersions.propTypes = {
    model: PropTypes.object.isRequired,
};

export default ModelVersions;
