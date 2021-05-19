import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Box, Divider } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { showtime } from 'tools/functions';
import Breadcrumb from 'components/breadcrumb';

const useStyles = makeStyles(() => ({
    list: {
        width: 'clamp(320px,100%, 600px)',
        '& li': {
            flexDirection: 'column',
            margin: '20px 0',
        },
    },
    title: {
        width: '100%',
        marginBottom: 20,
        '& h2': {
            padding: '20px 0 0',
        },
        '& h2, span': {
            textAlign: 'left',
        },
        '& > span:first-child': {
            fontSize: 12,
            textTransform: 'uppercase',
            fontWeight: 900,
        },
        '& > span:nth-child(3)': {
            fontSize: 12,
            fontWeight: 600,
            color: '#767676',
        },
    },
    body: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '210px 1fr',
        '& > div:nth-child(2)': {
            marginLeft: 20,
            '& p': {
                paddingBottom: 10,
                lineHeight: '1.8',
            },
        },
    },
    imgContainer: {
        width: 210,
        height: 140,
        backgroundColor: 'red',
    },
}));
const SoeezBlog = (props) => {
    const classes = useStyles();
    const { posts } = props;
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
                            href: '/',
                            text: 'accueil',
                        },
                        {
                            href: null,
                            text: 'soeez-blog',
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>Actualite automobiles neuves Maroc</h1>
                </div>
                <List className={classes.list}>
                    {posts?.edges.map((post) => (
                        <div key={post.node.slug}>
                            <ListItem>
                                <div className={classes.title}>
                                    <span>{post.node.categories.nodes[0].name}</span>

                                    <h2>{post.node.title}</h2>
                                    <span>{showtime(post.node.date)}</span>
                                </div>
                                <Box className={classes.body}>
                                    <div className={classes.imgContainer}>
                                        {post.node.featuredImage ? (
                                            <Image
                                                src={
                                                    post.node.featuredImage.node.sourceUrl
                                                }
                                                alt={post.node.title}
                                                width={210}
                                                height={140}
                                                loading="eager"
                                                priority
                                            />
                                        ) : null}
                                    </div>
                                    <div>
                                        {ReactHtmlParser(
                                            post.node.excerpt
                                                .replace('Regardez toutes les', '')
                                                .replace(/<a.*\/a>/, ''),
                                        )}
                                        <Link href={`/soeez-blog/${post.node.slug}`}>
                                            continuer la lecture...
                                        </Link>
                                    </div>
                                </Box>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </main>
        </div>
    );
};

SoeezBlog.propTypes = {
    posts: PropTypes.object.isRequired,
};

export default SoeezBlog;

export async function getStaticProps() {
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            posts,
        },
    };
}
