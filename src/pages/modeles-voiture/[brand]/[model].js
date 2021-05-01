import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';
import ModelPrices from 'components/modelPrices';
import ModelVersions from 'components/modelVersions';

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
        '& > a button': {
            width: '100%',
        },
    },
    mainContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 clamp(300px,100%,600px)',
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
    chart: {
        height: 400,
    },
    isPromo: {
        backgroundColor: '#F29C12',
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
                <ModelVersions model={model} isPromo={isPromo} />
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
                <Box className={classes.chart}>
                    <ModelPrices model={model} />
                </Box>
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
        fallback: false,
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
