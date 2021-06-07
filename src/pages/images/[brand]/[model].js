import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getBrandsModels from 'lib/getBrandsModels';
import { apiQl } from 'lib/functions';
import { urlWriter, randIndex, getBaseDate } from 'tools/functions';
import Loading from 'components/loading';
import Breadcrumb from 'components/breadcrumb';

const WidgetNav = dynamic(() => import('../../../components/widgetNav'), {
    ssr: false,
});

const WidgetLaunches = dynamic(() => import('../../../components/widgetLaunches'), {
    ssr: false,
});

const WidgetPromo = dynamic(() => import('../../../components/widgetPromotion'), {
    ssr: false,
});

const useStyles = makeStyles({
    root: {
        contentVisibility: 'auto',
        color: '#29335c',
        backgroundColor: '#ffe082',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardContent-root': {
            minHeight: '200px',
            '& img': {
                border: '2px solid #fff',
            },
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            // color: '#fff',
        },
    },
    imgContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        gap: 10,
    },
});

const ModelImages = ({ model, brands, randPromos, recentModels }) => {
    const classes = useStyles();
    const router = useRouter();
    if (!model || !brands || !randPromos || !recentModels || router.isFallback) {
        return <Loading />;
    }
    return (
        <div>
            <Head>
                <title>
                    {`Images ${model.brand.brand} ${model.model} neuve au Maroc |
                    soeezAuto`}
                </title>
                <meta
                    name="description"
                    content={`Images ${model.brand.brand} ${model.model} neuve au Maroc |
                    soeezAuto`}
                />
                <meta
                    property="og:title"
                    content={`Images ${model.brand.brand} ${model.model} neuve au Maroc |
                    soeezAuto`}
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/TODO/soeezauto-300-60.jpg"
                />
                <meta
                    property="og:url"
                    content={`https://www.soeezauto.ma/images/${urlWriter(
                        model.brand.brand,
                    )}/${urlWriter(model.model)}`}
                />
                <link
                    rel="canonical"
                    href={`https://www.soeezauto.ma/images/${urlWriter(
                        model.brand.brand,
                    )}/${urlWriter(model.model)}`}
                />
                <meta property="fb:pages" content="643004532437221" />
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
                            text: `images ${model.brand.brand} ${model.model}`,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`Images ${model.brand.brand} ${model.model} neuve au Maroc`}</h1>
                </div>
                <div className={classes.imgContainer}>
                    {model &&
                        model.images.map((img) => (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${img.filename}`}
                                alt={model.model}
                                key={img.filename}
                                width="400"
                                height="267"
                            />
                        ))}
                </div>
                <WidgetNav brands={brands} />
                <WidgetPromo data={randPromos} />
                <WidgetLaunches data={recentModels} />
            </main>
        </div>
    );
};

ModelImages.propTypes = {
    model: PropTypes.any,
    recentModels: PropTypes.any,
    randPromos: PropTypes.any,
    brands: PropTypes.any,
};

export default ModelImages;

const queryQl = `query getModel(
  	$id: ID!
) {
    model(id: $id) {
        id
    	model
    	modelYear
    	images {
            filename
        }
    	brand {
            id
            brand
            image
        }
    }
}`;

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const { model: modelParam } = params;
    let models = await getModels();
    models = models.data.models;
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === urlWriter(modelParam);
    });
    if (modelFilter.length === 0) {
        return {
            notFound: true,
        };
    }
    // data for widgets
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const randMod = randIndex(19, 6);
    const recentModels = models.filter((model, ind) => {
        return randMod.includes(ind);
    });
    // rand promos
    const promos = [];
    models.forEach((model) => {
        const promoVersions = model.versions.filter((version) => {
            return version.prices[0].promo !== null;
        });
        if (promoVersions.length > 0) {
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            promos.push(model);
        }
    });
    const selectedPromos = randIndex(promos.length, 6);
    const randPromos = promos.filter((model, ind) => {
        return selectedPromos.includes(ind + 1);
    });

    const variables = {
        id: modelFilter[0].id,
        after: getBaseDate(),
    };
    const data = await apiQl(queryQl, variables, false);
    const model = data.data.model;
    return {
        props: {
            model,
            brands,
            recentModels,
            randPromos,
        },
    };
}
