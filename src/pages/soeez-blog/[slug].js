import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import { apiWp } from 'lib/functions';
import BlogImage from 'components/blogImage';
import BlogVideo from 'components/blogVideo';
import BlogPost from 'components/blogPost';
import Loading from 'components/loading';

const Post = (props) => {
    const router = useRouter();
    const { post } = props;
    console.log('POST', post);
    if (router.isFallback) {
        return <Loading />;
    }
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {post && post.postFormats.nodes[0].name === 'Image' && (
                    <BlogImage post={post} />
                )}
                {post && post.postFormats.nodes[0].name === 'Vidéo' && (
                    <BlogVideo post={post} />
                )}
                {post && post.postFormats.nodes.length === 0 && <BlogPost post={post} />}
            </main>
        </div>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;

const queryQl = `query getPost($slug: ID!){
    post(idType: SLUG, id: $slug) {
        date
        excerpt
        title
        postFormats {
            nodes {
                name
            }
        }
        content
    }
}`;

export async function getStaticPaths() {
    let posts = await getPosts();
    posts = posts.data.posts;
    const paths = [];
    posts.edges.forEach((post) => {
        paths.push({
            params: {
                slug: post.node.slug,
            },
        });
    });
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const variables = {
        slug: params.slug,
    };
    console.log('VARIABLES', variables);
    const post = await apiWp(queryQl, variables);
    console.log('POST GET', post);
    return {
        props: {
            post: post.data.post,
        },
    };
}
