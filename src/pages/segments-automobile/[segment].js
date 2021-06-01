/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Head from 'next/head';
import {
    AppBar,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    Card,
    CardHeader,
    CardContent,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getSegments from 'lib/getSegments';
import getBrandsModels from 'lib/getBrandsModels';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';
import { PRICE_RANGES, CONVERSION_FUEL } from 'parameters';
import Link from 'components/link';
import Breadcrumb from 'components/breadcrumb';
import WidgetNav from 'components/widgetNav';
import WidgetLaunches from 'components/widgetLaunches';
import WidgetPromo from 'components/widgetPromotion';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`spec-tabpanel-${index}`}
            aria-labelledby={`spec-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `spec-tab-${index}`,
        'aria-controls': `spec-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        overflow: 'scroll',
        '& button': {
            minWidth: 'unset',
            // width: '33%',
            fontSize: '.75rem',
        },
    },
    table: {
        tableLayout: 'unset',
        '& td': {
            fontSize: '.75rem',
        },
        '& th': {
            fontSize: '.75rem',
            height: 80,
        },
    },
    cardRoot: {
        width: 'clamp(300px, 100%, 700px)',
        backgroundColor: '#ffe082',
        margin: '30px auto',
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
            flexDirection: 'column',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    cardContent: {
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        justifyContent: 'space-evenly',
        rowGap: '6px',
        gridGap: '6px',
        '& >div': {
            textAlign: 'center',
        },
    },
    ownBudget: {
        backgroundColor: '#fff',
        width: 'clamp(300px,50%,500px)',
        borderRadius: 8,
        display: 'grid',
        gridGap: 20,
        padding: 10,
        '& div:first-child': {
            textAlign: 'center',
        },
        '& .MuiChip-root': {
            width: '50%',
            margin: '0 auto',
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

const Segment = (props) => {
    const { segment, priceRanges, brands } = props;
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const getUnique = (versions, item) => {
        const allItems = versions.map((vs) => {
            if (item[1] === 'fuel') {
                return CONVERSION_FUEL[vs[item[0]][item[1]]];
            }
            return item.length === 1 ? vs[item[0]] : vs[item[0]][item[1]];
        });
        return [...new Set(allItems)].toString();
    };
    return (
        <div>
            <Head>
                <title>
                    {`Voitures ${segment.segment} neuves au Maroc | par budget et prix
                    ${segment.segment} neuf au Maroc`}
                </title>
                <meta
                    name="description"
                    content={`Toutes les voitures ${segment.segment} neuves au Maroc."`}
                />
                <meta
                    property="og:title"
                    content={`Voiture ${segment.segment} au Maroc `}
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/TODO/og/segment-petit-monospace-ford-b-max.jpg"
                />
                <meta
                    property="og:url"
                    content={`https://www.soeezauto.ma/segments-automobile/${urlWriter(
                        segment.segment,
                    )}`}
                />
                <link
                    rel="canonical"
                    href={`https://www.soeezauto.ma/segments-automobile/${urlWriter(
                        segment.segment,
                    )}`}
                />
            </Head>

            <main>
                <Breadcrumb
                    links={[
                        {
                            href: '/segments-automobile',
                            text: 'segments voiture',
                        },
                        {
                            href: null,
                            text: segment.segment,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`Voitures ${segment.segment} neuves Maroc`}</h1>
                    <Chip label={`${segment.modelsLength} modeles`} />
                </div>
                <Card className={classes.cardRoot}>
                    <CardHeader title="Modeles par gamme de prix" subheader="mille DH" />
                    <CardContent>
                        <div className={classes.root}>
                            <AppBar position="static">
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="on"
                                    aria-label="simple tabs example"
                                >
                                    {priceRanges.map((priceRange, index) => (
                                        <Tab
                                            key={priceRange.id}
                                            label={priceRange.id}
                                            {...a11yProps(index)}
                                        />
                                    ))}
                                </Tabs>
                            </AppBar>
                            {priceRanges.map((priceRange, index) => (
                                <TabPanel
                                    key={`panel${priceRange.id}`}
                                    value={tabValue}
                                    index={index}
                                >
                                    <TableContainer component={Paper}>
                                        <Table
                                            className={classes.table}
                                            aria-label={priceRange.id}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Brand
                                                    </TableCell>
                                                    {priceRange.models.map((model) => (
                                                        <TableCell key={model.model}>
                                                            {model.brand.brand}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Model
                                                    </TableCell>
                                                    {priceRange.models.map((model) => (
                                                        <TableCell key={model.model}>
                                                            <Link
                                                                href={`/modeles-voiture/${urlWriter(
                                                                    model.brand.brand,
                                                                )}/${urlWriter(
                                                                    model.model,
                                                                )}`}
                                                            >
                                                                {model.model}
                                                            </Link>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        No of versions
                                                    </TableCell>
                                                    {priceRange.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {model.versions.length}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Prix
                                                    </TableCell>
                                                    {priceRange.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {model.versions.length === 1
                                                                ? Math.floor(
                                                                      Math.round(
                                                                          model
                                                                              .versions[0]
                                                                              .prices[0]
                                                                              .price /
                                                                              1000,
                                                                      ),
                                                                  )
                                                                : `${Math.floor(
                                                                      Math.round(
                                                                          model
                                                                              .versions[0]
                                                                              .prices[0]
                                                                              .price /
                                                                              1000,
                                                                      ),
                                                                  )}-${Math.floor(
                                                                      Math.round(
                                                                          model.versions[
                                                                              model
                                                                                  .versions
                                                                                  .length -
                                                                                  1
                                                                          ].prices[0]
                                                                              .price /
                                                                              1000,
                                                                      ),
                                                                  )}`}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        fuel
                                                    </TableCell>
                                                    {priceRange.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'motor',
                                                                'fuel',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <WidgetNav brands={brands} />
                <WidgetLaunches data={brands} />
                <WidgetPromo data={brands} />
            </main>
        </div>
    );
};

Segment.propTypes = {
    priceRanges: PropTypes.array.isRequired,
    segment: PropTypes.object.isRequired,
    brands: PropTypes.array.isRequired,
};

export default Segment;

const queryQl = `query getSegment(
  		$id: ID!
  	    $isActiveModel: Boolean!
        $isActivePrice: Boolean!
        ){
    segment(id: $id) {
        id
        segment
        image
        models(isActive: $isActiveModel) {
            id
            model
            modelYear
            brand {
                id
                brand
            }
            versions(exists: {prices:true}) {
                id
                version
                prices(
                    isActive: $isActivePrice
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
    let segments = await getSegments();
    segments = segments.data.segments;
    const paths = [];
    segments.forEach((segment) => {
        paths.push({
            params: {
                segment: urlWriter(segment.segment),
            },
        });
    });
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { segment: segmentParam } = params;
    let segments = await getSegments();
    segments = segments.data.segments;
    let posts = await getPosts();
    posts = posts.data.posts;
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const segmentFilter = segments.filter((seg) => {
        return urlWriter(seg.segment) === segmentParam;
    });
    const variables = {
        id: segmentFilter[0].id,
        isActiveModel: true,
        isActivePrice: true,
    };
    const data = await apiQl(queryQl, variables, false);
    const segment = data.data.segment;
    const priceRanges = [];
    PRICE_RANGES.forEach((range) => {
        const newModels = [];
        segment.models.forEach((mod) => {
            const versions = mod.versions.filter((vs) => {
                return vs.prices[0].price > range[0] && vs.prices[0].price < range[1];
            });
            if (versions.length > 0) {
                newModels.push({ ...mod, versions });
            }
        });
        if (newModels.length > 0) {
            priceRanges.push({
                id: `${(parseInt(range[0], 10) - 1) / 1000}-${
                    parseInt(range[1], 10) / 1000
                }`,
                models: [...newModels],
            });
        }
    });
    return {
        props: {
            brands,
            priceRanges,
            posts,
            segment: {
                id: segment.id,
                segment: segment.segment,
                image: segment.image,
                modelsLength: segment.models.length,
            },
        },
    };
}
