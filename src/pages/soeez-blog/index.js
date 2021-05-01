import React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import Link from 'components/link';

const useStyles = makeStyles(() => ({
    catList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 280px',
        },
    },
}));
const SoeezBlog = (props) => {
    console.log('blog', props);
    const classes = useStyles();
    const { posts } = props;
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div className={classes.catList}>
                    {posts?.edges.map((post) => (
                        <div key={post.node.slug}>
                            <div>{post.node.title}</div>
                            <Link href={`/soeez-blog/${post.node.slug}`}>go to post</Link>
                        </div>
                    ))}
                </div>
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
