import React, { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Box,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter, numberFrance } from 'tools/functions';
import { apiQl } from 'lib/functions';
import Breadcrumb from 'components/breadcrumb';
import WidgetNav from 'components/widgetNav';
import WidgetLaunches from 'components/widgetLaunches';

const useStyles = makeStyles({
    root: {
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    h2: {
        fontSize: '1rem',
        hyphens: 'none',
    },
    brand: {
        backgroundColor: '#ffe082',
        marginBottom: 30,
    },
    cardContent: {
        padding: '8px',
        '& td': {
            fontSize: '.75rem',
        },
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 300px',
            margin: '20px 0',
            display: 'grid',
            gridTemplateRows: '100px auto 100px',
            boxShadow: '4px 9px 14px -1px rgba(255,193,7,0.62)',
        },
    },
    image: {
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        '& >a div:first-child': {
            borderRadius: 10,
        },
    },
    selectBrand: {
        height: 80,
        width: 300,
        margin: '0 auto',
    },
});

const Promotions = (props) => {
    const classes = useStyles();
    const { brands } = props;
    const [brandSelect, setBrandSelect] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState(brands);
    const handleSetBrandSelect = () => {
        const options = [
            <MenuItem key={0} aria-label="Toutes" value="all">
                Toutes
            </MenuItem>,
        ];
        brands.forEach((brand) => {
            options.push(
                <MenuItem value={brand.id} key={brand.id}>
                    {brand.brand}
                </MenuItem>,
            );
        });

        return options;
    };
    const handleBrandSelectChange = (event) => {
        setBrandSelect(event.target.value);
        if (event.target.value === 'all') {
            setSelectedBrand(brands);
        } else {
            setSelectedBrand(
                brands.filter((brand) => {
                    return brand.id === event.target.value;
                }),
            );
        }
    };
    return (
        <div>
            <Head>
                <title>{`Prix promotion offres voiture neuve au Maroc - ${new Date().getFullYear()}`}</title>
                <meta
                    name="description"
                    content="Découvrez toutes les voitures en promotion et offres. Prix et fiches techniques voiture neuve en promotion au Maroc. "
                />
                <meta
                    property="og:title"
                    content="Prix promotion offres voiture neuve au Maroc"
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/TODO/og/segment-petit-monospace-ford-b-max.jpg"
                />
                <meta
                    property="og:url"
                    content="https://www.soeezauto.ma/promotion-voiture-neuve-au-maroc"
                />
                <link
                    rel="canonical"
                    href="https://www.soeezauto.ma/promotion-voiture-neuve-au-maroc"
                />
            </Head>

            <main>
                <Breadcrumb
                    links={[
                        {
                            href: '/',
                            text: 'accueil',
                        },
                        {
                            href: null,
                            text: 'promotions',
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>Promotion voiture neuve au Maroc</h1>
                </div>
                <div className={classes.selectBrand}>
                    <form>
                        <div className="form_input form_select">
                            <FormControl variant="outlined">
                                <InputLabel id="brand-select-label">
                                    Select brand
                                </InputLabel>
                                <Select
                                    labelId="brand-select-label"
                                    id="brand-select"
                                    name="item"
                                    label="Select brand"
                                    value={brandSelect}
                                    onChange={handleBrandSelectChange}
                                    variant="outlined"
                                >
                                    {handleSetBrandSelect()}
                                </Select>
                                <span id="no_cat_search" className="form_error" />
                            </FormControl>
                        </div>
                    </form>
                </div>
                {selectedBrand.map((brand) => (
                    <div key={brand.id} className={classes.brand}>
                        <Box className={classes.image}>
                            <Link
                                href={`${
                                    process.env.NEXT_PUBLIC_CLIENT_HOST
                                }/marques-voiture/${urlWriter(brand.brand)}`}
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                                    alt={brand.brand}
                                    width="100"
                                    height="100"
                                    loading="eager"
                                    priority
                                />
                            </Link>
                        </Box>
                        <div className={classes.container}>
                            {brand.models.map((model) => (
                                <Card key={model.id} className={classes.root}>
                                    <CardHeader
                                        title={
                                            <h2
                                                className={classes.h2}
                                            >{`${brand.brand} ${model.model}`}</h2>
                                        }
                                        avatar={
                                            <Link
                                                key={model.model}
                                                href={`${
                                                    process.env.NEXT_PUBLIC_CLIENT_HOST
                                                }/modeles-voiture/${urlWriter(
                                                    brand.brand,
                                                )}/${urlWriter(model.model)}`}
                                            >
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                                    alt={`${brand.brand}-${model.model}`}
                                                    width="100"
                                                    height="67"
                                                    loading="eager"
                                                    priority
                                                />
                                            </Link>
                                        }
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width="50%">
                                                        Version
                                                    </TableCell>
                                                    <TableCell width="25%">
                                                        Prix
                                                    </TableCell>
                                                    <TableCell width="25%">
                                                        Promo
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {model.versions.map((version) => (
                                                    <TableRow key={version.id}>
                                                        <TableCell>
                                                            <Link
                                                                href={`/fiche-technique-prix/${urlWriter(
                                                                    brand.brand,
                                                                )}/${urlWriter(
                                                                    model.model,
                                                                )}`}
                                                            >
                                                                {version.version}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>
                                                            {numberFrance(
                                                                version.prices[0].price /
                                                                    1000,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {numberFrance(
                                                                version.prices[0].promo /
                                                                    1000,
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardActions>
                                        <Link
                                            key={model.model}
                                            href={`${
                                                process.env.NEXT_PUBLIC_CLIENT_HOST
                                            }/modeles-voiture/${urlWriter(
                                                brand.brand,
                                            )}/${urlWriter(model.model)}`}
                                        >
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                            >
                                                Voir le modele
                                            </Button>
                                        </Link>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
            <WidgetNav brands={brands} />
            <WidgetLaunches data={brands} />
        </div>
    );
};

Promotions.propTypes = {
    brands: PropTypes.array.isRequired,
};

export default Promotions;

const queryQl = `query getBrandsForPromo(
    $isActive: Boolean!,
    $isActiveModel: Boolean!
    $imageIsFeatured: Boolean!
    $isActivePrice: Boolean!
) {
    brands(
        isActive: $isActive
        _order: {brand: "ASC"}
    ) {
        id
        brand
        image
        models(
            isActive: $isActiveModel
            _order: {model: "ASC"}
        ){
            id
            model
            images(isFeatured: $imageIsFeatured) {
                filename
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
            }
        }
    }
}`;

export async function getStaticProps() {
    const variables = {
        isActive: true,
        isActiveModel: true,
        imageIsFeatured: true,
        isActivePrice: true,
    };
    const data = await apiQl(queryQl, variables, false);
    const brands = data.data.brands;
    const promoBrands = brands.filter((brand) => {
        const promoModels = brand.models.filter((model) => {
            const promoVersions = model.versions.filter((version) => {
                return version.prices[0].promo;
            });
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            return promoVersions.length > 0;
        });
        // eslint-disable-next-line no-param-reassign
        brand.models = promoModels;
        return promoModels.length > 0;
    });
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            brands: promoBrands,
            posts,
        },
    };
}
