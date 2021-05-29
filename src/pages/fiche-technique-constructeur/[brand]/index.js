import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getBrands from 'lib/getBrands';
import getBrandsModels from 'lib/getBrandsModels';
import { apiQl } from 'lib/functions';
import { urlWriter } from 'tools/functions';
import NotifierInline from 'components/notifierInline';
import Loading from 'components/loading';
import Breadcrumb from 'components/breadcrumb';
import WidgetNav from 'components/widgetNav';
import WidgetLaunches from 'components/widgetLaunches';
import WidgetPromo from 'components/widgetPromotion';

const useStyles = makeStyles(() => ({
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
        overflow: 'hidden',
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
    const router = useRouter();
    const [currentModel, setCurrentModel] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedModelIndex, setSelectedModelIndex] = useState(0);

    useEffect(() => {
        if (brand) {
            const modelsWithSpecs = brand.models.filter((model) => {
                return model.specs.length > 0;
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
    if (!brand || router.isFallback) {
        return <Loading />;
    }
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Breadcrumb
                    links={[
                        {
                            href: `/marques-voiture/${urlWriter(brand.brand)}`,
                            text: `${brand.brand}`,
                        },
                        {
                            href: null,
                            text: `Fiche technique constructeur - ${brand.brand}`,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`Fiche technique constructeur - ${brand.brand}`}</h1>
                </div>
                {models.length > 0 ? (
                    <Card className={classes.cardRoot}>
                        <CardHeader title={<h2>Modeles</h2>} />
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
                        <CardActions>
                            <Chip
                                label={
                                    <h2>{`Fiche technique ${brand.brand} ${currentModel.model}`}</h2>
                                }
                                color="secondary"
                            />
                        </CardActions>
                    </Card>
                ) : (
                    <NotifierInline
                        severity="info"
                        message="Aucune fiche technique du constructeur disponible à ce moment. Nous travaillons pour en ajouter. "
                    />
                )}
                {currentModel && (
                    <div className={classes.iframeContainer}>
                        <iframe
                            className={classes.responsiveIframe}
                            title={currentModel.specs[0].filename}
                            style={{ width: '100%', height: 1500 }}
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/specs/${urlWriter(
                                brand.brand,
                            )}/${
                                currentModel.specs[0].year
                            }-${currentModel.specs[0].month
                                .toString()
                                .padStart(2, '0')}/${currentModel.specs[0].filename}`}
                        />
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
    brand: PropTypes.object.isRequired,
    brandsModels: PropTypes.array.isRequired,
};

export default FicheTechniqueManufacturer;

const queryQl = `query getBrandSpecs(
  	$id: ID!
) {
    brand(id: $id) {
        brand
        models(isActive: true) {
            id
            model
            modelYear
            images(isFeatured: true) {
                filename
            }
            specs(_order: {year: "DESC", month: "DESC"}){
                id
                year
                month
                filename
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
        fallback: true,
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
