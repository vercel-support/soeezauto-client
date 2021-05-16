import React, { useState } from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Box,
    Chip,
    Avatar,
} from '@material-ui/core';
import { MonetizationOn } from '@material-ui/icons';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import { apiQl } from 'lib/functions';
import { urlWriter, numberFrance } from 'tools/functions';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';

const useStyles = makeStyles(() => ({
    mainContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 clamp(300px,100%,700px)',
            margin: '20px 0',
        },
    },
    root: {
        backgroundColor: '#ffe082',
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
            // color: '#fff',
        },
        '& .MuiChip-label': {
            fontWeight: 'bold',
        },
    },
    cardContent: {
        overflow: 'scroll',
        '& >div': {
            textAlign: 'center',
        },
        '& > a button': {
            width: '100%',
        },
    },
    versions: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 33%',
            marginBottom: 15,
        },
    },
    range: {
        width: '100%',
        height: '100%',
        '& > span': {
            fontWeight: 'bold',
        },
    },
}));

const FicheTechnique = (props) => {
    const { model } = props;
    const classes = useStyles();
    const [currentVersion, setCurrentVersion] = useState(model.versions[0]);
    const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

    const handleVersionSelect = (event) => {
        const newVersion = model.versions.filter((vs) => {
            return vs.id === event.target.id;
        });
        setCurrentVersion(newVersion[0]);
        setSelectedVersionIndex(parseInt(event.target.dataset.versionindex, 10));
    };

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div className="main-title">
                    <h1>{`Fiche technique & prix - ${model.brand.brand} ${model.model}`}</h1>
                </div>
                <div className={classes.mainContainer}>
                    <Card className={classes.root}>
                        <CardHeader title="Versions" />
                        <CardContent className={classes.cardContent}>
                            <Box className={classes.versions}>
                                {model.versions.map((version, index) => (
                                    <Box key={version.id}>
                                        <Button
                                            data-versionindex={index}
                                            id={version.id}
                                            className={classes.range}
                                            variant="contained"
                                            color={
                                                selectedVersionIndex === index
                                                    ? 'secondary'
                                                    : 'primary'
                                            }
                                            onClick={handleVersionSelect}
                                        >
                                            {version.version}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Chip
                                size="small"
                                label={`Prix:${numberFrance(
                                    currentVersion.prices[0].price,
                                )} DH`}
                                color="primary"
                                avatar={
                                    <Avatar>
                                        <MonetizationOn />
                                    </Avatar>
                                }
                            />
                            {currentVersion.prices[0].promo && (
                                <Chip
                                    className={classes.isPromo}
                                    size="small"
                                    avatar={
                                        <Avatar>
                                            <MonetizationOn />
                                        </Avatar>
                                    }
                                    label={`Promo:${numberFrance(
                                        currentVersion.prices[0].promo,
                                    )}  DH`}
                                    color="secondary"
                                />
                            )}
                        </CardActions>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title="Caracteristiques techniques" />
                        <CardContent className={classes.cardContent}>
                            <ModelSpecs versions={[currentVersion]} />
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title="Equipements" />
                        <CardContent className={classes.cardContent}>
                            <ModelTrims versions={[currentVersion]} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

FicheTechnique.propTypes = {
    model: PropTypes.object.isRequired,
};

export default FicheTechnique;

const queryQl = `query getModelDetails(
  	$id: ID!
) {
    model(id: $id) {
        model
        modelYear
        images(isFeatured: true) {
            filename
        }
        brand {
            id
            brand
            image
        }
        segment {
            id
            segment
        }
        specs(_order: {year: "DESC", month: "DESC"}){
            id
            year
            month
            filename
        }
        versions(
            isActive: true
            _order:{ bodyType: "ASC", motor_fuel: "ASC", prices_price: "ASC"}
        ){
            id
            version
            bodyType
            taxLuxe
            matricule
            tag
            paintMetal
            destCharges
            gearbox
            places
            doors
            curbWeight
            gvw
            traction
            tyreFr
            tyreBk
            prices(
                isActive: true
            ) {
                id
                updatedAt
                price
                promo
            }
            CF {
                CF
            }
            motor {
                power
                fuel
                cc
                cylinder
                torque
                valves
                aspiration
            }
            measures {
                fuelTank
                width
                height
                length
                wheelbase
                trunk
                trunkMax
            }
            performance {
                to100
                maxSpeed
                emissions
                mileageCity
                mileageRoad
                mileageMix
            }
            trims {
                id
                trim
                trimType
            }
        }
    }
}`;

export async function getServerSideProps(context) {
    const {
        params: { model: modelParam },
    } = context;
    let models = await getModels();
    models = models.data.models;
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === modelParam;
    });
    const variables = {
        id: modelFilter[0].id,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            model: data.data.model,
        },
    };
}
