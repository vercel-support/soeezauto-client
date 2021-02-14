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

const Home = (props) => {
    console.log('home props', props);
    const classes = useStyles();
    const { brands, segments, models, posts } = props;
    console.log('PROMOS', models);
    const promos = [];
    models.forEach((model) => {
        const promoVersions = model.versions.filter((version) => {
            return version.prices.edges[0].node.promo;
        });
        if (promoVersions.length > 0) {
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            promos.push(model);
        }
    });
    const selected = {
        brands: ['bmw', 'dacia', 'ford', 'peugeot', 'renault', 'volkswagen'],
        segments: [
            'citadine',
            'compacte',
            'suv compact',
            'routiere',
            'mini-crossover',
            'berlines de luxe',
        ],
        priceRanges: ['125-150', '150-175', '175-200', '250-300', '300-400', '400-500'],
        models: ['x3', 'focus', 'yaris', 'captur', 'logan', 'gle'],
    };
    const selectBrands = brands.filter((brand) => {
        return selected.brands.includes(brand.brand);
    });
    const selectSegments = segments.filter((segment) => {
        return selected.segments.includes(segment.segment);
    });
    const selectModels = models.filter((model) => {
        return selected.models.includes(model.model);
    });

    const randIndex = (len) => {
        const rand = [];
        while (rand.length < 6) {
            const r = Math.floor(Math.random() * len) + 1;
            if (rand.indexOf(r) === -1) rand.push(r);
        }
        console.log('rand', rand);
        return rand;
    };
    const randMod = randIndex(19);
    const recentModels = models.filter((model, ind) => {
        return randMod.includes(ind);
    });
    const postsWithImage = posts.edges.filter((post) => {
        return post.node.featuredImage;
    });
    const randProm = randIndex(promos.length);
    const randPromos = promos.filter((model, ind) => {
        return randProm.includes(ind);
    });
    console.log('PROM', randPromos);
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
                            <Button variant="outlined" color="primary" size="small">
                                Toutes les marques
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Segments" />
                    <CardContent className={classes.cardContent}>
                        {selectSegments.map((segment) => (
                            <Box>
                                <Link
                                    key={segment.segment}
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
                            <Button variant="outlined" color="primary" size="small">
                                Tous les segments
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Prix" />
                    <CardContent className={classes.cardContent}>
                        {selected.priceRanges.map((range) => (
                            <Box key={range}>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/prix-voiture/${range.split('-')[0] * 1000 + 1}-${
                                        range.split('-')[1] * 1000
                                    }/dh`}
                                >
                                    <Button
                                        className={classes.range}
                                        variant="contained"
                                        color="primary"
                                    >
                                        {range}
                                    </Button>
                                </Link>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Link href="/prix-voiture">
                            <Button variant="outlined" color="primary" size="small">
                                Tous les prix
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Modeles" />
                    <CardContent className={classes.cardContent}>
                        {selectModels.map((model) => (
                            <Box>
                                <Link
                                    key={model.model}
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
                            <Button variant="outlined" color="primary" size="small">
                                Tous les modeles
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Lancements" />
                    <CardContent className={classes.cardContent}>
                        {recentModels.map((model) => (
                            <Box>
                                <Link
                                    key={model.model}
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
                        {randPromos.map((model) => (
                            <Box>
                                <Link
                                    key={model.model}
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
                            <Button variant="outlined" color="primary" size="small">
                                Toutes les promotions
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title="Articles" />
                    <CardContent>
                        {postsWithImage.map((post) => (
                            <Box>
                                <Image
                                    key={post.node.slug}
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
    brands: PropTypes.array.isRequired,
    segments: PropTypes.array.isRequired,
    models: PropTypes.array.isRequired,
    posts: PropTypes.object.isRequired,
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
    return {
        props: {
            brands,
            posts,
            segments,
            models,
        },
    };
}
