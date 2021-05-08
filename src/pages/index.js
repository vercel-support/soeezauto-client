import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import getBrands from 'lib/getBrands';
import getPosts from 'lib/getPosts';
import getSegments from 'lib/getSegments';
import getModels from 'lib/getModels';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const useStyles = makeStyles({
    root: {
        color: '#29335c',
        backgroundColor: 'rgb(218, 165, 32)',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardContent-root': {
            height: '200px',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: '#fff',
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
    subtitle: {
        fontSize: '.65rem',
        fontWeight: 'bold',
        position: 'relative',
        top: '-6px',
    },
    range: {
        width: '100%',
        height: '100%',
        '& > span': {
            fontWeight: 'bold',
        },
    },
});

const randIndex = (len, max) => {
    const rand = [];
    while (rand.length < max) {
        const r = Math.floor(Math.random() * len) + 1;
        if (rand.indexOf(r) === -1) rand.push(r);
    }
    return rand;
};

const Home = (props) => {
    // console.log('home props', props);
    const classes = useStyles();
    const {
        selectBrands,
        selectSegments,
        selectModels,
        postsWithImage,
        recentModels,
        randPromos,
    } = props;

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={classes.mainContainer}>
                <Card className={classes.root}>
                    <CardHeader title="marques" />
                    <CardContent className={classes.cardContent}>
                        {selectBrands.map((brand) => (
                            <Box key={brand.brand}>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/marques-voiture/${urlWriter(brand.brand)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                                        alt={brand.brand}
                                        width="60"
                                        height="60"
                                        loading="eager"
                                        priority
                                    />
                                </Link>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Link href="/marques-voiture">
                            <Button variant="contained" color="primary" size="small">
                                Toutes les marques
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Segments" />
                    <CardContent className={classes.cardContent}>
                        {selectSegments.map((segment) => (
                            <Box key={segment.segment}>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/segments-automobile/${urlWriter(segment.segment)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/segments/${segment.image}`}
                                        alt={segment.segment}
                                        width="90"
                                        height="60"
                                        loading="eager"
                                        priority
                                    />
                                </Link>
                                <span className={classes.subtitle}>
                                    {segment.segment}
                                </span>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Link href="/segments-automobile">
                            <Button variant="contained" color="primary" size="small">
                                Tous les segments
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Modeles" />
                    <CardContent className={classes.cardContent}>
                        {selectModels.map((model) => (
                            <Box key={model.model}>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/modeles-voiture/${urlWriter(
                                        model.brand.brand,
                                    )}/${urlWriter(model.model)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                        alt={model.model}
                                        width="90"
                                        height="60"
                                        loading="eager"
                                        priority
                                    />
                                </Link>
                                <span
                                    className={classes.subtitle}
                                >{`${model.brand.brand} ${model.model}`}</span>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Link href="/modeles-voiture">
                            <Button variant="contained" color="primary" size="small">
                                Tous les modeles
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Lancements" />
                    <CardContent className={classes.cardContent}>
                        {recentModels?.map((model) => (
                            <Box key={model.model}>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/modeles-voiture/${urlWriter(
                                        model.brand.brand,
                                    )}/${urlWriter(model.model)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                        alt={model.model}
                                        width="90"
                                        height="60"
                                        loading="eager"
                                        priority
                                    />
                                </Link>
                                <span
                                    className={classes.subtitle}
                                >{`${model.brand.brand} ${model.model}`}</span>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions />
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Promotions" />
                    <CardContent className={classes.cardContent}>
                        {randPromos?.map((model) => (
                            <Box key={model.id}>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/modeles-voiture/${urlWriter(
                                        model.brand.brand,
                                    )}/${urlWriter(model.model)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                                        alt={model.model}
                                        width="90"
                                        height="60"
                                        loading="eager"
                                        priority
                                    />
                                </Link>
                                <span
                                    className={classes.subtitle}
                                >{`${model.brand.brand} ${model.model}`}</span>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Link href="/promotion-voiture-neuve-au-maroc">
                            <Button variant="contained" color="primary" size="small">
                                Toutes les promotions
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Articles" />
                    <CardContent>
                        {postsWithImage.map((post) => (
                            <Box key={post.node.slug}>
                                <Image
                                    src={post.node.featuredImage.node.sourceUrl}
                                    alt={post.node.slug}
                                    width="300"
                                    height="200"
                                    loading="eager"
                                    priority
                                />
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

Home.propTypes = {
    selectBrands: PropTypes.array.isRequired,
    selectSegments: PropTypes.array.isRequired,
    selectModels: PropTypes.array.isRequired,
    postsWithImage: PropTypes.array.isRequired,
    recentModels: PropTypes.array.isRequired,
    randPromos: PropTypes.array.isRequired,
};

export default Home;

export async function getStaticProps() {
    let brands = await getBrands();
    let posts = await getPosts();
    let segments = await getSegments();
    let models = await getModels();
    brands = brands.data.brands;
    segments = segments.data.segments;
    posts = posts.data.posts;
    models = models.data.models;
    const randMod = randIndex(19, 6);
    const recentModels = models.filter((model, ind) => {
        return randMod.includes(ind);
    });
    // rand promos
    const promos = [];
    models.forEach((model) => {
        const promoVersions = model.versions.filter((version) => {
            return version.prices.promo !== null;
        });
        if (promoVersions.length > 0) {
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            promos.push(model);
        }
    });

    const selected = {
        brands: randIndex(brands.length, 6),
        segments: randIndex(segments.length, 6),
        models: randIndex(models.length, 6),
        promos: randIndex(promos.length, 6),
    };
    const selectBrands = brands.filter((brand, ind) => {
        return selected.brands.includes(ind + 1);
    });
    const selectSegments = segments.filter((segment, ind) => {
        return selected.segments.includes(ind + 1);
    });
    const selectModels = models.filter((model, ind) => {
        return selected.models.includes(ind + 1);
    });
    const randPromos = promos.filter((model, ind) => {
        return selected.promos.includes(ind + 1);
    });

    const postsWithImage = posts.edges.filter((post) => {
        return post.node.featuredImage;
    });
    return {
        props: {
            selectBrands,
            postsWithImage,
            selectSegments,
            selectModels,
            randMod,
            recentModels,
            randPromos,
        },
    };
}
