import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getSegmentsModels from 'lib/getSegmentsModels';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const useStyles = makeStyles(() => ({
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
        '& >div': {
            textAlign: 'center',
        },
    },
    catList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        gap: 10,
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 280px',
            backgroundColor: '#ffe082',
        },
    },
}));

const Segments = (props) => {
    const classes = useStyles();
    const { segments } = props;
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className={classes.catList}>
                    {segments.map((segment) => (
                        <Card key={segment.segment} className={classes.root}>
                            <CardHeader title={segment.segment} />
                            <CardContent className={classes.cardContent}>
                                <Box>
                                    <Link
                                        href={`${
                                            process.env.NEXT_PUBLIC_CLIENT_HOST
                                        }/segments-automobile/${urlWriter(
                                            segment.segment,
                                        )}`}
                                    >
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/segments/${segment.image}`}
                                            alt={segment.segment}
                                            width="300"
                                            height="200"
                                            loading="eager"
                                            priority
                                        />
                                    </Link>
                                </Box>
                            </CardContent>
                            <CardActions>
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
            </main>
        </div>
    );
};

Segments.propTypes = {
    segments: PropTypes.array.isRequired,
};

export default Segments;

export async function getStaticProps() {
    let segments = await getSegmentsModels();
    segments = segments.data.segments;
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            segments,
            posts,
        },
    };
}
