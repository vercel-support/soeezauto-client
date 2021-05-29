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
import Link from 'components/link';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gridGap: 30,
        padding: 6,
    },
    article: {
        width: 'clamp(320px,100%, 600px)',
        margin: '0 0 50px',
        lineHeight: 1.8,
        '& p': {
            // margin: '20px 0',
            // fontSize: 15,
            fontWeight: 400,
            fontSize: '1rem !important',
            lineHeight: '26px !important',
            color: '#4D4D4D',
            margin: '0 0 38px !important',
            textAlign: 'justify',
            textJustify: 'inter-word',
        },
        '& h2': {
            margin: '20px 0',
        },
        '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '.75rem',
        },
        '& tr:nth-of-type(odd)': {
            background: '#eee',
        },
        '& th': {
            background: theme.palette.primary.main,
            color: 'white',
            fontWeight: 'bold',
        },
        '& th, td': {
            padding: 6,
            border: '1px solid #ccc',
            textAlign: 'left',
        },
    },
    navLink: {
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        hyphens: 'auto',
        wordWrap: 'break-word',
        '& a': {
            color: '#2b2b2b',
            display: 'block',
            fontSize: '14px',
            fontWeight: '700',
            lineHeight: '1.7142857142',
            textTransform: 'none',
            '&:hover': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
            },
        },
        '& span': {
            color: '#767676',
            display: 'block',
            fontSize: '12px',
            fontSeight: '900',
            lineHeight: '2',
            textTransform: 'uppercase',
            textDecoration: 'none',
            '&:hover': {
                color: 'none',
            },
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
                <div className={classes.mainContainer}>
                    <div>
                        <article className={classes.article}>
                            {postFormat === 'Image' && <BlogImage post={post} />}
                            {postFormat === 'Vidéo' && <BlogVideo post={post} />}
                            {postFormat === 'Standard' && <BlogPost post={post} />}
                        </article>
                        <div className={classes.navLink}>
                            {post?.previous && (
                                <Link href={`/soeez-blog/${post.previous.slug}`}>
                                    <span>Article précédent:</span>
                                    {post.previous.title}
                                </Link>
                            )}
                            {post?.next && (
                                <Link href={`/soeez-blog/${post.next.slug}`}>
                                    <span>Article suivant:</span>
                                    {post.next.title}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div>
                        <WidgetNav brands={brands} />
                        <WidgetLaunches data={brands} />
                        <WidgetPromo data={brands} />
                    </div>
                </div>
            </main>
        </div>
    );
};

Post.propTypes = {
    post: PropTypes.any,
    postFormat: PropTypes.any,
    brands: PropTypes.any,
};

export default Post;

const queryQl = `query getPost($slug: ID!) {
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
        next {
            slug
            title
        }
        previous {
            slug
            title
        }
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
