import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
import getBrandsModels from 'lib/getBrandsModels';
import getModels from 'lib/getModels';
import { apiQl } from 'lib/functions';
import { urlWriter, numberFrance, getBaseDate } from 'tools/functions';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';
import Loading from 'components/loading';
import Breadcrumb from 'components/breadcrumb';
import WidgetNav from 'components/widgetNav';
import WidgetLaunches from 'components/widgetLaunches';
import WidgetPromo from 'components/widgetPromotion';
import Link from 'components/link';

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
            flexDirection: 'column',
            '& .MuiCard-root': {
                width: '100%',
                margin: '10px 0',
            },
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
            // color: '#fff',
        },
        '& .MuiChip-label': {
            fontWeight: 'bold',
        },
        '& .MuiCardHeader-avatar': {
            padding: 6,
            borderRadius: 10,
            backgroundColor: '#fff',
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
        gap: 10,
        '& > div': {
            flex: '0 0 clamp(100px, 45%, 100%)',
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
    isPromo: {
        marginTop: 20,
    },
}));

const FicheTechnique = (props) => {
    const { model, brandsModels: brands } = props;
    const classes = useStyles();
    const router = useRouter();
    const [currentVersion, setCurrentVersion] = useState(null);
    const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

    useEffect(() => {
        if (model) {
            setCurrentVersion(model.versions[0]);
        }
    }, [model]);

    const handleVersionSelect = (event) => {
        const newVersion = model.versions.filter((vs) => {
            return vs.id === event.target.id;
        });
        setCurrentVersion(newVersion[0]);
        setSelectedVersionIndex(parseInt(event.target.dataset.versionindex, 10));
    };
    if (router.isFallback) {
        return <Loading />;
    }
    return (
        <div>
            <Head>
                <title>
                    {`Fiche technique ${model.brand.brand} ${model.model} neuves au Maroc | guide d'achat,
                    prix, comparatif`}
                </title>
                <meta
                    name="description"
                    content={`Fiche technique ${model.brand.brand} ${model.model} neuves au Maroc, guide d'achat, prix, comparatif`}
                />
                <meta
                    property="og:title"
                    content={`Fiche technique ${model.brand.brand} ${model.model} neuves au Maroc, prix`}
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.com/images/TODO.png"
                />
                <meta
                    property="og:url"
                    content={`https://www.soeezauto.ma/fiche-technique-prix/${urlWriter(
                        model.brand.brand,
                    )}/${urlWriter(model.model)}`}
                />
                <link
                    rel="canonical"
                    href={`https://www.soeezauto.ma/fiche-technique-prix/${urlWriter(
                        model.brand.brand,
                    )}/${urlWriter(model.model)}`}
                />
            </Head>

            <main>
                <Breadcrumb
                    links={[
                        {
                            href: `/modeles-voiture/${urlWriter(
                                model.brand.brand,
                            )}/${urlWriter(model.model)}`,
                            text: `${model.brand.brand} ${model.model}`,
                        },
                        {
                            href: null,
                            text: `fiche technique ${model.brand.brand} ${model.model}`,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`Fiche technique & prix - ${model.brand.brand} ${model.model}`}</h1>
                </div>
                <div className={classes.mainContainer}>
                    {model && currentVersion && (
                        <>
                            <Card className={classes.root}>
                                <CardHeader
                                    title={<h2>Versions</h2>}
                                    avatar={
                                        <Link
                                            href={`/marques-voiture/${urlWriter(
                                                model.brand.brand,
                                            )}`}
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
                                        label={`Prix: ${numberFrance(
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
                                            label={`Promo: ${numberFrance(
                                                currentVersion.prices[0].promo,
                                            )}  DH`}
                                            color="secondary"
                                        />
                                    )}
                                    <Card className={classes.root}>
                                        <CardHeader
                                            title={<h2>Caracteristiques techniques</h2>}
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <ModelSpecs versions={[currentVersion]} />
                                        </CardContent>
                                    </Card>
                                    <Card className={classes.root}>
                                        <CardHeader title={<h2>Equipements</h2>} />
                                        <CardContent className={classes.cardContent}>
                                            <ModelTrims versions={[currentVersion]} />
                                        </CardContent>
                                    </Card>
                                    {model.specs.edges.length > 0 && (
                                        <Box className={classes.fiche}>
                                            <Link
                                                href={`/fiche-technique-constructeur/${urlWriter(
                                                    model.brand.brand,
                                                )}`}
                                                target="_blank"
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                >
                                                    Fiche technique constructeur
                                                </Button>
                                            </Link>
                                        </Box>
                                    )}
                                </CardActions>
                            </Card>
                        </>
                    )}
                </div>
                <WidgetPromo data={brands} />
                <WidgetNav brands={brands} />
                <WidgetLaunches data={brands} />
            </main>
        </div>
    );
};

FicheTechnique.propTypes = {
    model: PropTypes.any,
    brandsModels: PropTypes.array.isRequired,
};

export default FicheTechnique;

const queryQl = `query getModelDetails(
  	$id: ID!
    $after: String!
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
        specs(
            first: 1, after: null,
            _order: {updatedAt: "DESC"}
            updatedAt: {after: $after}
        ) {
            edges {
                node {
                    id
                    filename
                    updatedAt
                }
            }
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

export async function getStaticPaths() {
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const paths = [];
    // only generate static for a few brands
    const selectedBrands = ['bmw', 'dacia', 'peugeot', 'renault', 'volkswagen'];
    brands.forEach((brand) => {
        if (selectedBrands.includes(urlWriter(brand.brand))) {
            brand.models.forEach((model) => {
                paths.push({
                    params: {
                        brand: urlWriter(brand.brand),
                        model: urlWriter(model.model),
                    },
                });
            });
        }
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
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === modelParam;
    });

    const variables = {
        id: modelFilter[0].id,
        after: getBaseDate(90),
    };
    const data = await apiQl(queryQl, variables, false);
    let brandsModels = await getBrandsModels();
    brandsModels = brandsModels.data.brands;
    return {
        props: {
            model: data.data.model,
            brandsModels,
        },
    };
}
