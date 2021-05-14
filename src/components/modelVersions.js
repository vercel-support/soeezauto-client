import React from 'react';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    Button,
    Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { urlWriter } from 'tools/functions';
import Link from 'components/link';
import { CONVERSION_FUEL } from 'parameters';

const useStyles = makeStyles({
    aButton: {
        fontWeight: 700,
    },
});

const ModelVersions = ({ model, isPromo }) => {
    console.log('MODEL VERllSIONS', model);
    const classes = useStyles();
    return (
        <>
            <TableContainer component={Paper} className={classes.table}>
                <Table aria-label="fiches techniques">
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
                                        href={`/fiche-technique-prix/${urlWriter(
                                            model.brand.brand,
                                        )}/${urlWriter(model.model)}`}
                                    >
                                        {version.version}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {CONVERSION_FUEL[version.motor.fuel]}
                                </TableCell>
                                <TableCell>{version.motor.power}</TableCell>
                                {!isPromo && <TableCell>{version.CF.CF}</TableCell>}
                                <TableCell>{version.prices[0].price / 1000}</TableCell>
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
                <Box>
                    <Link
                        href={`/fiche-technique-constructeur/${urlWriter(
                            model.brand.brand,
                        )}`}
                        target="_blank"
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.aButton}
                        >
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
    isPromo: PropTypes.bool.isRequired,
};

export default ModelVersions;
