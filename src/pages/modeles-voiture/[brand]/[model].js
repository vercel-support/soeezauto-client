import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
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
    Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';
import Link from 'components/link';
import { CONVERSION_FUEL } from 'parameters';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';

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
    cardContent: {
        padding: 0,
        overflow: 'scroll',
        // display: 'grid',
        // gridTemplateColumns: '1fr 1fr 1fr',
        // justifyContent: 'space-evenly',
        // rowGap: '6px',
        // gridGap: '6px',
        '& >div': {
            textAlign: 'center',
        },
        '& h6': {
            textAlign: 'center',
            backgroundColor: '#F29C12',
            color: '#fff',
            fontWeight: 'bold',
        },
    },
    mainContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 300px',
            margin: '20px 0',
        },
    },
    table: {
        '& th': {
            fontWeight: 600,
            fontSize: '.75rem',
        },
        '& th:first-child': {
            width: 100,
        },
        '& td': {
            fontSize: '.75rem',
        },
    },
});

const Model = ({ model, isPromo }) => {
    console.log('model', model);
    const classes = useStyles();

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={classes.mainContainer}>
                <div>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                        alt={model.model}
                        width="300"
                        height="200"
                        loading="eager"
                        priority
                    />
                </div>
                <Card className={classes.root}>
                    <CardHeader
                        title={model.model}
                        avatar={
                            <Link
                                href={`/marques-voiture/${urlWriter(model.brand.brand)}`}
                            >
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
                        {isPromo && <Typography variant="h6">PROMO</Typography>}
                        <TableContainer component={Paper}>
                            <Table
                                className={classes.table}
                                aria-label="fiches techniques"
                            >
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
                                            {!isPromo && (
                                                <TableCell>{version.CF.CF}</TableCell>
                                            )}
                                            <TableCell>
                                                {version.prices[0].price / 1000}
                                            </TableCell>
                                            {isPromo && (
                                                <TableCell>
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
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Caracteristiques techniques" />
                    <CardContent className={classes.cardContent}>
                        <ModelSpecs versions={model.versions} />
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Equipements" />
                    <CardContent className={classes.cardContent}>
                        <ModelTrims versions={model.versions} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

Model.propTypes = {
    model: PropTypes.object.isRequired,
    isPromo: PropTypes.bool.isRequired,
};
/*
const mapStateToProps = (state) => {
    return {};
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetModelVersionsWithTrims,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Model);
*/
export default Model;

const queryQl = `query getModel(
  	$id: ID!
) {
    model(id: $id) {
        id
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
        versions(
            isActive: true
            _order:{ bodyType: "ASC", motor_fuel: "ASC", prices_price: "ASC"}
        ){
            id
            version
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
                _order: {updatedAt: "DESC"}
            ) {
                id
                updatedAt
                price
                promo
                isActive
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
            trims(_order: { trim: "ASC"}) {
                id
                trim
                trimType
            }
        }
    }
}`;

export async function getStaticPaths() {
    let models = await getModels();
    models = models.data.models;
    const paths = [];
    models.forEach((model) => {
        paths.push({
            params: {
                brand: urlWriter(model.brand.brand),
                model: urlWriter(model.model),
            },
        });
    });
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const { model: modelParam } = params;
    let models = await getModels();
    models = models.data.models;
    let posts = await getPosts();
    posts = posts.data.posts;
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === modelParam;
    });
    const variables = {
        id: modelFilter[0].id,
    };
    const data = await apiQl(queryQl, variables, false);
    const model = data.data.model;
    const prom = model.versions.filter((version) => {
        return version.prices[0].promo;
    });
    return {
        props: {
            model,
            posts,
            isPromo: prom.length > 0,
        },
    };
}
