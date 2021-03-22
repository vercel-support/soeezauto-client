import React from 'react';
import Image from 'next/image';
import {
    Card,
    CardHeader,
    CardContent,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { urlWriter } from 'tools/functions';
import Link from 'components/link';
import { CONVERSION_FUEL } from 'parameters';

const useStyles = makeStyles({
    root: {
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardContent-root': {
            // height: '200px',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
});

const ModelVersions = ({ model, isPromo }) => {
    console.log('MODEL VERSIONS', model);
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardHeader
                title={model.model}
                avatar={
                    <Link href={`/marques-voiture/${urlWriter(model.brand.brand)}`}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${model.brand.image}`}
                            alt={model.brand.brand}
                            width="60"
                            height="60"
                            loading="eager"
                            priority
                        />
                    </Link>
                }
            />
            <CardContent className={classes.cardContent}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="fiches techniques">
                        <TableHead>
                            <TableRow>
                                <TableCell>Version</TableCell>
                                <TableCell>Carb</TableCell>
                                <TableCell>ch</TableCell>
                                {!isPromo && <TableCell>CF</TableCell>}
                                <TableCell>Prix</TableCell>
                                {isPromo && <TableCell>Promo</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {model.versions.map((version) => (
                                <TableRow key={version.id}>
                                    <TableCell>
                                        <Link
                                            href={`/fiche-technique/${urlWriter(
                                                model.brand.brand,
                                            )}/${urlWriter(
                                                model.model,
                                            )}/${version.id.replace(
                                                '/api/versions/',
                                                '',
                                            )}`}
                                        >
                                            {version.version}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {CONVERSION_FUEL[version.motor.fuel]}
                                    </TableCell>
                                    <TableCell>{version.motor.power}</TableCell>
                                    {!isPromo && <TableCell>{version.CF.CF}</TableCell>}
                                    <TableCell>
                                        {version.prices[0].price / 1000}
                                    </TableCell>
                                    {isPromo && (
                                        <TableCell
                                            className={classnames(
                                                version.prices[0].promo
                                                    ? classes.isPromo
                                                    : '',
                                            )}
                                        >
                                            {version.prices[0].promo
                                                ? version.prices[0].promo / 1000
                                                : '-'}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {model.specs.length > 0 && (
                    <Link
                        href={`/fiche-technique-constructeur/${urlWriter(
                            model.brand.brand,
                        )}/${
                            model.specs[0].year
                        }/${model.specs[0].month.toString().padStart(2, '0')}/${
                            model.specs[0].filename
                        }`}
                        target="_blank"
                    >
                        <Button variant="outlined" color="secondary">
                            Fiche technique constructeur
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    );
};

ModelVersions.propTypes = {
    model: PropTypes.object.isRequired,
    isPromo: PropTypes.bool.isRequired,
};

export default ModelVersions;
