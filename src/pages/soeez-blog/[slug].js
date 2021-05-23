import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import getBrandsModels from 'lib/getBrandsModels';
import { apiWp } from 'lib/functions';
import BlogImage from 'components/blogImage';
import BlogVideo from 'components/blogVideo';
import BlogPost from 'components/blogPost';
import Loading from 'components/loading';
import Breadcrumb from 'components/breadcrumb';
import WidgetNav from 'components/widgetNav';
import WidgetLaunches from 'components/widgetLaunches';
import WidgetPromo from 'components/widgetPromotion';

const useStyles = makeStyles(() => ({
    article: {
        width: 'clamp(320px,100%, 600px)',
        margin: '0 0 50px',
        lineHeight: 1.8,
        '& p': {
            margin: '20px 0',
            fontSize: 15,
        },
        '& h2': {
            margin: '20px 0',
        },
    },
}));

const Post = ({ post, postFormat, brands }) => {
    const router = useRouter();
    const classes = useStyles();
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
                <Breadcrumb
                    links={[
                        {
                            href: '/soeez-blog',
                            text: 'accueil blog',
                        },
                        {
                            href: null,
                            text: post.title,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{post.title}</h1>
                </div>
                <article className={classes.article}>
                    {postFormat === 'Image' && <BlogImage post={post} />}
                    {postFormat === 'Vidéo' && <BlogVideo post={post} />}
                    {postFormat === 'Standard' && <BlogPost post={post} />}
                </article>
                <WidgetNav brands={brands} />
                <WidgetLaunches data={brands} />
                <WidgetPromo data={brands} />
            </main>
        </div>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    postFormat: PropTypes.string.isRequired,
    brands: PropTypes.array.isRequired,
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
    let post = await apiWp(queryQl, variables);
    post = post.data.post;
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const getPostFormat = () => {
        if (post.postFormats.nodes.length === 0) {
            return 'Standard';
        }
        return post.postFormats.nodes[0].name;
    };
    return {
        props: {
            post,
            postFormat: getPostFormat(),
            brands,
        },
    };
}
