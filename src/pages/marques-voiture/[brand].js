/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Image from 'next/image';
import Head from 'next/head';
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
} from '@material-ui/core';
import { MonetizationOn } from '@material-ui/icons';
import { orange, cyan } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { AUTOMATIC_GEARBOXES, CONVERSION_FUEL, PRICE_RANGES_SHORT } from 'parameters';
import getBrands from 'lib/getBrands';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
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

const useStyles = makeStyles({
    root: {
        backgroundColor: '#daa520',
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
            color: '#fff',
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
        '& td': {
            borderBottom: '2px solid #daa520',
        },
        '& li': {
            flexDirection: 'column',
            paddingLeft: 2,
            paddingRight: 2,
            '& p': {
                color: cyan[800],
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
});

const Brand = (props) => {
    console.log('brand props', props);
    console.log('GLUE', orange);
    const {
        brand,
        allModels,
        dataGetModelsWithAutomaticGearboxForBrand,
        dataGetModelsWithAirCondAutoForBrand,
        dataGetModelsWithDisplayMultimediaForBrand,
        dataGetModelsWithFuelForBrand,
        dataGetModelsWithLeatherSeatsForBrand,
        dataGetModelsWithPowerRangeForBrand,
        dataGetModelsWithPriceRangeForBrand,
    } = props;
    const classes = useStyles();
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
    }, []);
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
    console.log('PRICE RANGE INDEx', priceRangeIndex);
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div className="main-title">
                    <h1>{`${brand.brand} neuve maroc`}</h1>
                </div>
                <Box className={classes.mainContent}>
                    <Card className={classes.root}>
                        <CardHeader
                            title="Modeles"
                            avatar={
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                                    alt={brand.brand}
                                    width="60"
                                    height="60"
                                    loading="eager"
                                    priority
                                />
                            }
                        />
                        <CardContent className={classes.cardContent}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="modeles">
                                    <TableBody>
                                        {allModels.map((model) => (
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
                                                                width="100"
                                                                height="60"
                                                                loading="eager"
                                                                priority
                                                            />
                                                            <p>{model.model}</p>
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <List>
                                                        <ListItem>
                                                            <>
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
                                                                <p
                                                                    className={
                                                                        classes.prices
                                                                    }
                                                                >
                                                                    {model.prices
                                                                        .length === 1
                                                                        ? `${model.prices[0]}`
                                                                        : `${model.prices[0]} - ${model.prices[1]}`}
                                                                    <span> mille DH</span>
                                                                </p>
                                                                <p>
                                                                    {model.power
                                                                        .length === 1
                                                                        ? model.power[0]
                                                                        : `${model.power[0]}-${model.power[1]}`}
                                                                    <span> ch</span>
                                                                </p>
                                                                <p>
                                                                    {model.fuels
                                                                        .toString()
                                                                        .replace(
                                                                            /,/g,
                                                                            '/',
                                                                        )}
                                                                </p>
                                                            </>
                                                        </ListItem>
                                                    </List>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                    <ModelFilter allModels={allModels} filters={filters} />
                </Box>
            </main>
        </div>
    );
};

Brand.propTypes = {
    brand: PropTypes.object.isRequired,
    allModels: PropTypes.array.isRequired,
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
		$isActiveModel: Boolean!) {
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
    let brands = await getBrands();
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
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { brand: brandParam } = params;
    let brands = await getBrands();
    brands = brands.data.brands;
    let posts = await getPosts();
    posts = posts.data.posts;
    const brandFilter = brands.filter((br) => {
        return urlWriter(br.brand) === brandParam;
    });
    const variables = {
        id: brandFilter[0].id,
        isActiveModel: true,
    };
    const data = await apiQl(queryQl, variables, false);
    const brand = data.data.brand;
    // get price range, power range
    // same as /pages/modeles-voiture/index.js
    const allModels = brand.models;
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
    });
    return {
        props: {
            brand,
            allModels,
            posts,
        },
    };
}
