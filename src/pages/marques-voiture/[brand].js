/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Paper,
    List,
    ListItem,
    Box,
    Chip,
    Avatar,
    Button,
} from '@material-ui/core';
import { MonetizationOn } from '@material-ui/icons';
import { orange, cyan } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { AUTOMATIC_GEARBOXES, CONVERSION_FUEL, PRICE_RANGES_SHORT } from 'parameters';
import getBrandsModels from 'lib/getBrandsModels';
import getPosts from 'lib/getPosts';
import { urlWriter, getBaseDate } from 'tools/functions';
import { apiQl } from 'lib/functions';
import {
    actionGetModelsWithAutomaticGearboxForBrand,
    actionGetModelsWithAirCondAutoForBrand,
    actionGetModelsWithDisplayMultimediaForBrand,
    actionGetModelsWithFuelForBrand,
    actionGetModelsWithLeatherSeatsForBrand,
    actionGetModelsWithPowerRangeForBrand,
    actionGetModelsWithPriceRangeForBrand,
} from 'store/actions';
import Link from 'components/link';
import ModelFilter from 'components/modelFilter';
import Breadcrumb from 'components/breadcrumb';
import Loading from 'components/loading';

const WidgetNav = dynamic(() => import('../../components/widgetNav'), {
    ssr: false,
});

const WidgetLaunches = dynamic(() => import('../../components/widgetLaunches'), {
    ssr: false,
});

const WidgetPromo = dynamic(() => import('../../components/widgetPromotion'), {
    ssr: false,
});

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#ffe082',
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
            // color: '#fff',
        },
        '& .MuiCardHeader-avatar': {
            padding: 6,
            backgroundColor: '#fff',
            borderRadius: 10,
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
    table: {
        '& li': {
            flexDirection: 'column',
            paddingLeft: 2,
            paddingRight: 2,
            '& p': {
                color: cyan[800],
            },
        },
        [theme.breakpoints.down('xs')]: {
            '& td': {
                padding: 4,
            },
        },
    },
    linkImage: {
        '& p': {
            textTransform: 'uppercase',
            fontWeight: 700,
        },
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gridGap: 30,
    },
    info: {
        '& li > div': {
            width: '100%',
        },
    },
    isPromo: {
        '& span': {
            fontWeight: 700,
            padding: '4px 12px',
            textTransform: 'uppercase',
        },
    },
    prices: {
        fontWeight: 700,
        color: orange[800],
        '& span': {
            fontWeight: 400,
            fontSize: '.7rem',
        },
    },
    fiche: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            fontWeight: 700,
        },
    },
}));

const Brand = (props) => {
    const {
        brands,
        brand,
        allModels,
        isSpecs,
        dataGetModelsWithAutomaticGearboxForBrand,
        dataGetModelsWithAirCondAutoForBrand,
        dataGetModelsWithDisplayMultimediaForBrand,
        dataGetModelsWithFuelForBrand,
        dataGetModelsWithLeatherSeatsForBrand,
        dataGetModelsWithPowerRangeForBrand,
        dataGetModelsWithPriceRangeForBrand,
    } = props;

    const classes = useStyles();
    const router = useRouter();
    const [filters, setFilters] = useState({
        airCondAuto: null,
        displayMultimedia: null,
        hybrid: null,
        leatherSeats: null,
        automaticGearbox: null,
        powerBetween150200: null,
        priceBetween0200: null,
        priceBetween200300: null,
        priceBetween300400: null,
        priceHigherThan400: null,
    });
    const [priceRangeIndex, setPriceRangeIndex] = useState(0);
    useEffect(() => {
        if (brand) {
            props.actionGetModelsWithAutomaticGearboxForBrand({
                isActive: true,
                gearbox: AUTOMATIC_GEARBOXES,
                brand: brand.id,
            });
            props.actionGetModelsWithAirCondAutoForBrand({
                isActive: true,
                brand: brand.id,
            });
            props.actionGetModelsWithDisplayMultimediaForBrand({
                isActive: true,
                brand: brand.id,
            });
            props.actionGetModelsWithFuelForBrand({
                isActive: true,
                brand: brand.id,
                fuel: 'hybrid',
            });
            props.actionGetModelsWithLeatherSeatsForBrand({
                isActive: true,
                brand: brand.id,
            });
            props.actionGetModelsWithPowerRangeForBrand({
                brand: brand.id,
                isActive: true,
                min: '150',
                max: '200',
            });
            props.actionGetModelsWithPriceRangeForBrand({
                brand: brand.id,
                isActive: true,
                min: PRICE_RANGES_SHORT[0][0],
                max: PRICE_RANGES_SHORT[0][1],
            });
        }
    }, [brand]);
    useEffect(() => {
        if (dataGetModelsWithAutomaticGearboxForBrand) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                automaticGearbox: dataGetModelsWithAutomaticGearboxForBrand.map(
                    (mod) => mod.id,
                ),
            }));
        }
    }, [dataGetModelsWithAutomaticGearboxForBrand]);
    useEffect(() => {
        if (dataGetModelsWithAirCondAutoForBrand) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                airCondAuto: dataGetModelsWithAirCondAutoForBrand.map((mod) => mod.id),
            }));
        }
    }, [dataGetModelsWithAirCondAutoForBrand]);
    useEffect(() => {
        if (dataGetModelsWithDisplayMultimediaForBrand) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                displayMultimedia: dataGetModelsWithDisplayMultimediaForBrand.map(
                    (mod) => mod.id,
                ),
            }));
        }
    }, [dataGetModelsWithDisplayMultimediaForBrand]);
    useEffect(() => {
        if (dataGetModelsWithFuelForBrand) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                hybrid: dataGetModelsWithFuelForBrand.map((mod) => mod.id),
            }));
        }
    }, [dataGetModelsWithFuelForBrand]);
    useEffect(() => {
        if (dataGetModelsWithLeatherSeatsForBrand) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                leatherSeats: dataGetModelsWithLeatherSeatsForBrand.map((mod) => mod.id),
            }));
        }
    }, [dataGetModelsWithLeatherSeatsForBrand]);
    useEffect(() => {
        if (dataGetModelsWithPowerRangeForBrand) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                powerBetween150200: dataGetModelsWithPowerRangeForBrand.map(
                    (mod) => mod.id,
                ),
            }));
        }
    }, [dataGetModelsWithPowerRangeForBrand]);
    useEffect(() => {
        if (
            dataGetModelsWithPriceRangeForBrand &&
            priceRangeIndex < PRICE_RANGES_SHORT.length
        ) {
            let prop;
            if (priceRangeIndex < PRICE_RANGES_SHORT.length - 1) {
                prop = `priceBetween${PRICE_RANGES_SHORT[priceRangeIndex][0].replace(
                    '000',
                    '',
                )}${PRICE_RANGES_SHORT[priceRangeIndex][1].replace('000', '')}`;
            } else {
                prop = `priceHigherThan${PRICE_RANGES_SHORT[priceRangeIndex][0].replace(
                    '000',
                    '',
                )}`;
            }
            setFilters((prevFilters) => ({
                ...prevFilters,
                [prop]: dataGetModelsWithPriceRangeForBrand.map((mod) => mod.id),
            }));
            if (priceRangeIndex < PRICE_RANGES_SHORT.length - 2) {
                props.actionGetModelsWithPriceRangeForBrand({
                    brand: brand.id,
                    isActive: true,
                    min: PRICE_RANGES_SHORT[priceRangeIndex + 1][0],
                    max: PRICE_RANGES_SHORT[priceRangeIndex + 1][1],
                });
            } else if (priceRangeIndex === PRICE_RANGES_SHORT.length - 2) {
                props.actionGetModelsWithPriceRangeForBrand({
                    brand: brand.id,
                    isActive: true,
                    min: PRICE_RANGES_SHORT[priceRangeIndex + 1][0],
                    max: '',
                });
            }
            setPriceRangeIndex((prevPriceRangeIndex) => prevPriceRangeIndex + 1);
        }
    }, [dataGetModelsWithPriceRangeForBrand]);

    if (!brand || router.isFallback) {
        return <Loading />;
    }

    return (
        <div>
            <Head>
                <title>
                    {`Voitures ${brand.brand} neuves au Maroc | guide
                    d'achat, modèles, prix, fiches techniques`}
                </title>
                <meta
                    name="description"
                    content={`${brand.brand} neuve au Maroc, guide d'achat, prix, fiches techniques, comparatif, nouveautés`}
                />
                <meta
                    property="og:title"
                    content={`Voitures ${brand.brand} au Maroc, modèles, prix, fiches techniques`}
                />
                <meta
                    property="og:image"
                    content={`https://www.soeezauto.com/images/brands/${urlWriter(
                        brand.brand,
                    )}.png`}
                />
                <meta
                    property="og:url"
                    content={`https://www.soeezauto.ma/marques-voiture/${urlWriter(
                        brand.brand,
                    )}`}
                />
                <link
                    rel="canonical"
                    href={`https://www.soeezauto.ma/marques-voiture/${urlWriter(
                        brand.brand,
                    )}`}
                />
            </Head>

            <main>
                <Breadcrumb
                    links={[
                        {
                            href: '/marques-voiture',
                            text: 'marques voiture',
                        },
                        {
                            href: null,
                            text: brand.brand,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`${brand.brand} neuve maroc`}</h1>
                </div>
                <Box className={classes.mainContent}>
                    <Card className={classes.root}>
                        <CardHeader
                            title={<h2>Modèles</h2>}
                            avatar={
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                                    alt={brand.brand}
                                    width="60"
                                    height="60"
                                    priority
                                />
                            }
                        />
                        <CardContent className={classes.cardContent}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="modèles">
                                    <TableBody>
                                        {allModels.map((model, ind) => (
                                            <TableRow key={model.model}>
                                                <TableCell>
                                                    <Link
                                                        href={`/modeles-voiture/${urlWriter(
                                                            brand.brand,
                                                        )}/${urlWriter(model.model)}`}
                                                    >
                                                        <div
                                                            className={classes.linkImage}
                                                        >
                                                            {' '}
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                                                alt={model.model}
                                                                width="180"
                                                                height="120"
                                                                priority={ind < 3}
                                                            />
                                                            <h2>{model.model}</h2>
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <List className={classes.info}>
                                                        <ListItem>
                                                            {model.isPromo && (
                                                                <Chip
                                                                    className={
                                                                        classes.isPromo
                                                                    }
                                                                    size="small"
                                                                    avatar={
                                                                        <Avatar>
                                                                            <MonetizationOn />
                                                                        </Avatar>
                                                                    }
                                                                    label="PROMO"
                                                                    color="secondary"
                                                                />
                                                            )}
                                                        </ListItem>
                                                        <ListItem>
                                                            <Chip
                                                                size="small"
                                                                label={`Prix ${
                                                                    model.prices
                                                                        .length === 1
                                                                        ? `${model.prices[0]}`
                                                                        : `${model.prices[0]} - ${model.prices[1]}`
                                                                } mille DH
                                                                `}
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
                                                                label={`Puissance: ${
                                                                    model.power.length ===
                                                                    1
                                                                        ? model.power[0]
                                                                        : `${model.power[0]}-${model.power[1]}`
                                                                } ch`}
                                                            />
                                                        </ListItem>
                                                        <ListItem>
                                                            <Chip
                                                                size="small"
                                                                label={model.fuels
                                                                    .toString()
                                                                    .replace(/,/g, '/')}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {isSpecs && (
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Box className={classes.fiche}>
                                                        <Link
                                                            href={`/fiches-techniques/marque/${urlWriter(
                                                                brand.brand,
                                                            )}`}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                            >
                                                                Fiches techniques
                                                                constructeur
                                                            </Button>
                                                        </Link>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                    <div>
                        <ModelFilter allModels={allModels} filters={filters} />
                        <WidgetNav brands={brands} />
                        <WidgetLaunches data={brands} />
                        <WidgetPromo data={brands} />
                    </div>
                </Box>
            </main>
        </div>
    );
};

Brand.propTypes = {
    brands: PropTypes.any,
    brand: PropTypes.any,
    allModels: PropTypes.any,
    isSpecs: PropTypes.any,
    actionGetModelsWithAutomaticGearboxForBrand: PropTypes.func.isRequired,
    actionGetModelsWithAirCondAutoForBrand: PropTypes.func.isRequired,
    actionGetModelsWithDisplayMultimediaForBrand: PropTypes.func.isRequired,
    actionGetModelsWithFuelForBrand: PropTypes.func.isRequired,
    actionGetModelsWithLeatherSeatsForBrand: PropTypes.func.isRequired,
    actionGetModelsWithPowerRangeForBrand: PropTypes.func.isRequired,
    actionGetModelsWithPriceRangeForBrand: PropTypes.func.isRequired,
    dataGetModelsWithAutomaticGearboxForBrand: PropTypes.any,
    dataGetModelsWithAirCondAutoForBrand: PropTypes.any,
    dataGetModelsWithDisplayMultimediaForBrand: PropTypes.any,
    dataGetModelsWithFuelForBrand: PropTypes.any,
    dataGetModelsWithLeatherSeatsForBrand: PropTypes.any,
    dataGetModelsWithPowerRangeForBrand: PropTypes.any,
    dataGetModelsWithPriceRangeForBrand: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        dataGetModelsWithAutomaticGearboxForBrand:
            state.brand.dataGetModelsWithAutomaticGearboxForBrand,
        dataGetModelsWithAirCondAutoForBrand:
            state.brand.dataGetModelsWithAirCondAutoForBrand,
        dataGetModelsWithDisplayMultimediaForBrand:
            state.brand.dataGetModelsWithDisplayMultimediaForBrand,
        dataGetModelsWithFuelForBrand: state.brand.dataGetModelsWithFuelForBrand,
        dataGetModelsWithLeatherSeatsForBrand:
            state.brand.dataGetModelsWithLeatherSeatsForBrand,
        dataGetModelsWithPowerRangeForBrand:
            state.brand.dataGetModelsWithPowerRangeForBrand,
        dataGetModelsWithPriceRangeForBrand:
            state.brand.dataGetModelsWithPriceRangeForBrand,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetModelsWithAutomaticGearboxForBrand,
            actionGetModelsWithAirCondAutoForBrand,
            actionGetModelsWithDisplayMultimediaForBrand,
            actionGetModelsWithFuelForBrand,
            actionGetModelsWithLeatherSeatsForBrand,
            actionGetModelsWithPowerRangeForBrand,
            actionGetModelsWithPriceRangeForBrand,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Brand);

const queryQl = `query getBrand(
  	    $id: ID!
		$isActiveModel: Boolean!
        $after: String!
    ) {
        brand(id: $id) {
		    id
		    brand
            image
            models(isActive: $isActiveModel){
                id
                model
                modelYear
                images(isFeatured: true) {
                    filename
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
                        }
                    }
                }
                versions(exists: {prices:true}) {
                    id
                    version
                    prices(
                        isActive: true
                    ) {
                        id
                        updatedAt
                        price
                        promo
                    }
                    motor {
                        power
                        fuel
                    }
                }
            }
        }
    }`;

export async function getStaticPaths() {
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const paths = [];
    brands.forEach((brand) => {
        paths.push({
            params: {
                brand: urlWriter(brand.brand),
            },
        });
    });
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const { brand: brandParam } = params;
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const brandFilter = brands.filter((br) => {
        return urlWriter(br.brand) === urlWriter(brandParam);
    });
    if (brandFilter.length === 0) {
        return {
            notFound: true,
        };
    }
    // redirect in case valid brand with capital letters
    if (/[A-Z]/.test(brandParam)) {
        return {
            redirect: {
                destination: `/marques-voiture/${urlWriter(brandParam)}`,
                permanent: true,
            },
        };
    }
    let posts = await getPosts();
    posts = posts.data.posts;
    const variables = {
        id: brandFilter[0].id,
        isActiveModel: true,
        after: getBaseDate(90),
    };
    const data = await apiQl(queryQl, variables, false);

    const brand = data.data.brand;
    // get price range, power range
    // same as /pages/modeles-voiture/index.js
    const allModels = brand.models;
    let isSpecs = false;
    allModels.forEach((model) => {
        model.brand = brand.brand;
        const prices = model.versions.map((version) => {
            return Math.round(version.prices[0].price / 1000);
        });
        model.prices = Array.from(new Set([Math.min(...prices), Math.max(...prices)]));
        const power = model.versions.map((version) => {
            return version.motor.power;
        });
        model.power = Array.from(new Set([Math.min(...power), Math.max(...power)]));
        let fuels = model.versions.map((version) => {
            return version.motor.fuel;
        });
        fuels = Array.from(new Set(fuels));
        fuels.forEach((item, i) => {
            fuels[i] = CONVERSION_FUEL[item];
        });
        model.fuels = fuels.sort();
        const prom = model.versions.filter((version) => {
            return version.prices[0].promo;
        });
        model.isPromo = prom.length > 0;
        if (!isSpecs) {
            isSpecs = model.specs.edges.length > 0;
        }
    });
    return {
        props: {
            brands,
            brand,
            allModels,
            posts,
            isSpecs,
        },
    };
}
