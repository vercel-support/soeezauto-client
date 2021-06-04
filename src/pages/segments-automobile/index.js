import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getSegmentsModels from 'lib/getSegmentsModels';
import getBrandsModels from 'lib/getBrandsModels';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';
import Breadcrumb from 'components/breadcrumb';

const WidgetNav = dynamic(() => import('../../components/widgetNav'), {
    ssr: false,
});

const WidgetLaunches = dynamic(() => import('../../components/widgetLaunches'), {
    ssr: false,
});

const WidgetPromo = dynamic(() => import('../../components/widgetPromotion'), {
    ssr: false,
});

const useStyles = makeStyles(() => ({
    root: {
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardContent-root': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#fff',
            padding: '10px 0',
            margin: '0 6px',
            '& >div': {
                textAlign: 'center',
            },
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 10,
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    catList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        gap: 20,
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 300px',
            backgroundColor: '#ffe082',
        },
    },
}));

const Segments = (props) => {
    const classes = useStyles();
    const { segments, brands } = props;
    return (
        <div>
            <Head>
                <title>
                    Tous segments et types voiture au Maroc | prix, comparatif automobile
                    segments automobile au Maroc |
                </title>
                <meta
                    name="description"
                    content="Toutes les voitures neuves, tous segments et types voitures au Maroc.  "
                />
                <meta
                    property="og:title"
                    content="Tous segments et types voiture au Maroc"
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/TODO/og/segment-petit-monospace-ford-b-max.jpg"
                />
                <meta
                    property="og:url"
                    content="https://www.soeezauto.ma/segments-automobile"
                />
                <link
                    rel="canonical"
                    href="https://www.soeezauto.ma/segments-automobile"
                />
            </Head>
            <main>
                <Breadcrumb
                    links={[
                        {
                            href: null,
                            text: 'segments voiture',
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>Segments voiture au Maroc</h1>
                </div>
                <div className={classes.catList}>
                    {segments.map((segment) => (
                        <Card key={segment.segment} className={classes.root}>
                            <CardHeader title={<h2>{segment.segment}</h2>} />
                            <CardContent>
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/segments-automobile/${urlWriter(segment.segment)}`}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_HOST}/images/segments/${segment.image}`}
                                        alt={segment.segment}
                                        width="240"
                                        height="160"
                                        loading="eager"
                                        priority
                                    />
                                </Link>
                            </CardContent>
                            <CardActions>
                                <Chip label={`${segment.models.length} modèles`} />
                                <Link
                                    href={`${
                                        process.env.NEXT_PUBLIC_CLIENT_HOST
                                    }/segments-automobile/${urlWriter(segment.segment)}`}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                    >
                                        {segment.segment}
                                    </Button>
                                </Link>
                            </CardActions>
                        </Card>
                    ))}
                </div>
                <WidgetNav brands={brands} />
                <WidgetLaunches data={brands} />
                <WidgetPromo data={brands} />
            </main>
        </div>
    );
};

Segments.propTypes = {
    segments: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};

export default Segments;

export async function getStaticProps() {
    let segments = await getSegmentsModels();
    segments = segments.data.segments;
    let posts = await getPosts();
    posts = posts.data.posts;
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    return {
        props: {
            segments,
            posts,
            brands,
        },
    };
}
