import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Box, Card, CardHeader, CardContent, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getBrands from 'lib/getBrands';
import getBrandsModels from 'lib/getBrandsModels';
import { apiQl } from 'lib/functions';
import { urlWriter, getBaseDate } from 'tools/functions';
import NotifierInline from 'components/notifierInline';
import Loading from 'components/loading';
import Breadcrumb from 'components/breadcrumb';
import Link from 'components/link';

const WidgetNav = dynamic(() => import('../../../components/widgetNav'), {
    ssr: false,
});

const WidgetLaunches = dynamic(() => import('../../../components/widgetLaunches'), {
    ssr: false,
});

const WidgetPromo = dynamic(() => import('../../../components/widgetPromotion'), {
    ssr: false,
});

const useStyles = makeStyles(() => ({
    mainContainer: {
        minHeight: 220,
    },
    currentModel: {
        minHeight: 500,
    },
    cardRoot: {
        backgroundColor: '#ffe082',
        width: 'clamp(300px, 100%, 700px)',
        margin: '20px auto',
        color: '#fff',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
            flexDirection: 'column',
            '& h2': {
                color: '#fff',
                fontSize: '.8rem',
            },
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    cardContent: {
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
    iframeContainer: {
        position: 'relative',
        overflowY: 'scroll',
        width: '100%',
        paddingTop: '130%',
    },
    responsiveIframe: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
    },
}));

const FicheTechniqueManufacturer = ({ brand, brandsModels: brands }) => {
    const classes = useStyles();
    const [currentModel, setCurrentModel] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedModelIndex, setSelectedModelIndex] = useState(0);

    useEffect(() => {
        if (brand) {
            const modelsWithSpecs = brand.models.filter((model) => {
                return model.specs.edges.length > 0;
            });
            if (modelsWithSpecs.length > 0) {
                setModels([...modelsWithSpecs]);
                setCurrentModel(modelsWithSpecs[0]);
            }
        }
    }, [brand]);
    const handleModelSelect = (event) => {
        const newModel = models.filter((mod) => {
            return mod.id === event.target.id;
        });
        setCurrentModel(newModel[0]);
        setSelectedModelIndex(parseInt(event.target.dataset.modelindex, 10));
    };
    if (!brand) {
        return <Loading />;
    }
    return (
        <div>
            <Head>
                <title>
                    {`Fiche technique constructeur ${brand.brand} neuve au Maroc | guide d'achat,
                    prix, comparatif`}
                </title>
                <meta
                    name="description"
                    content={`Fiche technique constructeur ${brand.brand} neuve au Maroc, guide d'achat, prix, comparatif`}
                />
                <meta
                    property="og:title"
                    content={`Fiche technique constructeur ${brand.brand} neuve au Maroc, prix`}
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.com/images/TODO.png"
                />
                <meta
                    property="og:url"
                    content={`https://www.soeezauto.ma/fiches-techniques/marque/${urlWriter(
                        brand.brand,
                    )}`}
                />
                <link
                    rel="canonical"
                    href={`https://www.soeezauto.ma/fiches-techniques/marque/${urlWriter(
                        brand.brand,
                    )}`}
                />
            </Head>
            <main>
                <Breadcrumb
                    links={[
                        {
                            href: '/fiches-techniques',
                            text: 'Fiches techniques',
                        },
                        {
                            href: null,
                            text: `Constructeur - ${brand.brand}`,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`Fiche technique constructeur - ${brand.brand}`}</h1>
                </div>
                <div className={classes.mainContainer}>
                    {models.length > 0 ? (
                        <Card className={classes.cardRoot}>
                            <CardHeader
                                title={<h2>Modèles</h2>}
                                avatar={
                                    <Link
                                        href={`/marques-voiture/${urlWriter(
                                            brand.brand,
                                        )}`}
                                    >
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                                            alt={`${brand.brand}`}
                                            width="100"
                                            height="100"
                                            loading="eager"
                                            priority
                                        />
                                    </Link>
                                }
                            />
                            <CardContent className={classes.cardContent}>
                                {models.map((model, index) => (
                                    <Box key={model.model}>
                                        <Button
                                            data-modelindex={index}
                                            id={model.id}
                                            className={classes.range}
                                            variant="contained"
                                            color={
                                                selectedModelIndex === index
                                                    ? 'secondary'
                                                    : 'primary'
                                            }
                                            onClick={handleModelSelect}
                                        >
                                            {model.model}
                                        </Button>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                        <NotifierInline
                            severity="info"
                            message="Aucune fiche technique du constructeur disponible à ce moment. Nous travaillons pour en ajouter. "
                        />
                    )}
                </div>
                {currentModel && (
                    <div className={classes.currentModel}>
                        <h2 className="main-title">{`Fiche technique ${brand.brand} ${currentModel.model}`}</h2>
                        <div className={classes.iframeContainer}>
                            <iframe
                                className={classes.responsiveIframe}
                                title={currentModel.specs.edges[0].node.filename}
                                // style={{ width: '100%', height: 1500 }}
                                src={`${
                                    process.env.NEXT_PUBLIC_API_HOST
                                }/specs/${urlWriter(brand.brand)}/${new Date(
                                    currentModel.specs.edges[0].node.updatedAt,
                                ).getFullYear()}/${(
                                    new Date(
                                        currentModel.specs.edges[0].node.updatedAt,
                                    ).getMonth() + 1
                                )
                                    .toString()
                                    .padStart(2, '0')}/${
                                    currentModel.specs.edges[0].node.filename
                                }`}
                            />
                        </div>
                    </div>
                )}
                <WidgetPromo data={brands} />
                <WidgetNav brands={brands} />
                <WidgetLaunches data={brands} />
            </main>
        </div>
    );
};

FicheTechniqueManufacturer.propTypes = {
    brand: PropTypes.any,
    brandsModels: PropTypes.any,
};

export default FicheTechniqueManufacturer;

const queryQl = `query getBrandSpecs(
  	$id: ID!
    $after: String!
) {
    brand(id: $id) {
        brand
        image
        models(isActive: true) {
            id
            model
            modelYear
            images(isFeatured: true) {
                filename
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
    const brandFilter = brands.filter((brand) => {
        return urlWriter(brand.brand) === brandParam;
    });

    const variables = {
        id: brandFilter[0].id,
        after: getBaseDate(90),
    };
    const data = await apiQl(queryQl, variables, false);
    let brandsModels = await getBrandsModels();
    brandsModels = brandsModels.data.brands;
    return {
        props: {
            brand: data.data.brand,
            brandsModels,
        },
    };
}
