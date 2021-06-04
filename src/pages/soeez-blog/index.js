import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Box, Divider } from '@material-ui/core';
import { NavigateBefore, NavigateNext, Image as ImageIcon } from '@material-ui/icons/';
import ReactHtmlParser from 'react-html-parser';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import { actionGetPostsNext, actionGetPostsPrevious } from 'store/actions';
import getPosts from 'lib/getPosts';
import getBrandsModels from 'lib/getBrandsModels';
import Link from 'components/link';
import stylesPagination from 'styles/pagination.module.scss';
import { showtime } from 'tools/functions';
import Breadcrumb from 'components/breadcrumb';
import Loading from 'components/loading';
import NotifierDialog from 'components/notifierDialog';

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
    mainContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gridGap: 30,
    },
    list: {
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        '& > div:nth-child(2)': {
            '& p': {
                paddingBottom: 10,
                lineHeight: '1.8',
            },
        },
    },
    imgContainer: {
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
        width: 210,
        height: 140,
        margin: '10px auto',
        '& svg': {
            height: 100,
            width: 100,
            color: '#FFC107',
        },
    },
}));

const ITEMS_PER_PAGE = 10;

const SoeezBlog = (props) => {
    const classes = useStyles();
    const {
        posts,
        brands,
        dataGetPostsNext,
        errorGetPostsNext,
        dataGetPostsPrevious,
        errorGetPostsPrevious,
        isLoading,
    } = props;

    const [currentPosts, setCurrentPosts] = useState(posts.edges);
    const [startCursor, setStartCursor] = useState(posts.pageInfo.startCursor);
    const [endCursor, setEndCursor] = useState(posts.pageInfo.endCursor);
    const [selectedPage, setSelectedPage] = useState(0);
    const [pageCount] = useState(Math.ceil(posts.pageInfo.total / ITEMS_PER_PAGE));
    const [notification, setNotification] = useState({
        status: '',
        title: '',
        message: '',
        errors: {},
    });

    useEffect(() => {
        if (dataGetPostsNext) {
            setCurrentPosts(dataGetPostsNext.edges);
            setStartCursor(dataGetPostsNext.pageInfo.startCursor);
            setEndCursor(dataGetPostsNext.pageInfo.endCursor);
        }
        if (errorGetPostsNext) {
            setNotification({
                status: 'ok_and_dismiss',
                title: 'Il a eu une erreur',
                message: 'Merci de ressayer',
                errors: {},
            });
        }
    }, [dataGetPostsNext, errorGetPostsNext]);

    useEffect(() => {
        if (dataGetPostsPrevious) {
            setCurrentPosts(dataGetPostsPrevious.edges);
            setStartCursor(dataGetPostsPrevious.pageInfo.startCursor);
            setEndCursor(dataGetPostsPrevious.pageInfo.endCursor);
        }
        if (errorGetPostsPrevious) {
            setNotification({
                status: 'ok_and_dismiss',
                title: 'Il a eu une erreur',
                message: 'Merci de ressayer',
                errors: {},
            });
        }
    }, [dataGetPostsPrevious, errorGetPostsPrevious]);

    const handlePageClick = (data) => {
        const selected = data.selected;
        if (selected > selectedPage) {
            const values = {
                cursor: endCursor,
            };
            props.actionGetPostsNext(values);
        } else {
            const values = {
                cursor: startCursor,
            };
            props.actionGetPostsPrevious(values);
        }
        setSelectedPage(selected);
    };

    const handleNotificationDismiss = () => {
        setNotification({
            status: '',
            title: '',
            message: '',
            errors: {},
        });
    };

    return (
        <div>
            <Head>
                <title>soeez-Blog, actualite automobile du Maroc et du monde Maroc</title>
                <meta
                    name="robots"
                    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
                />
                <meta
                    name="description"
                    content="Toute actualité automobile, nouvelles voitures, comparatifs, budget, lancement Maroc, opinion et analyse"
                />
                <meta
                    property="og:title"
                    content="soeez-Blog, actualité automobile du Maroc et du monde"
                />
                <meta
                    property="og:description"
                    content="Toute l’actualité automobile, nouvelles voitures, comparatifs, budget, lancement Maroc, opinion et analyse"
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/wp/wp-content/uploads/2014/10/soeezauto-logo-laranja-800.jpg"
                />
                <meta property="og:url" content="https://www.soeezauto.ma/soeez-blog/" />
                <link rel="canonical" href="https://www.soeezauto.ma/soeez-blog/" />
            </Head>

            <main>
                <NotifierDialog
                    notification={notification}
                    handleNotificationDismiss={handleNotificationDismiss}
                />
                <Breadcrumb
                    links={[
                        {
                            href: null,
                            text: 'soeez-blog',
                        },
                    ]}
                />
                {isLoading && <Loading />}
                <div className="main-title">
                    <h1>Actualite automobile Maroc</h1>
                </div>
                <div className={classes.mainContainer}>
                    <div>
                        <List className={classes.list}>
                            {currentPosts?.map((post) => (
                                <div key={post.node.slug}>
                                    <ListItem>
                                        <div className={classes.title}>
                                            <span>
                                                {post.node.categories.nodes[0].name}
                                            </span>

                                            <h2>
                                                <Link
                                                    href={`/soeez-blog/${post.node.slug}`}
                                                >
                                                    {post.node.title}
                                                </Link>
                                            </h2>
                                            <span>{showtime(post.node.date)}</span>
                                        </div>
                                        <Box className={classes.body}>
                                            <div className={classes.imgContainer}>
                                                {post.node.featuredImage ? (
                                                    <Image
                                                        src={
                                                            post.node.featuredImage.node
                                                                .sourceUrl
                                                        }
                                                        alt={post.node.title}
                                                        width={210}
                                                        height={140}
                                                        loading="eager"
                                                        priority
                                                    />
                                                ) : (
                                                    <ImageIcon />
                                                )}
                                            </div>
                                            <div>
                                                {ReactHtmlParser(
                                                    post.node.excerpt
                                                        .replace(
                                                            'Regardez toutes les',
                                                            '',
                                                        )
                                                        .replace(/<a.*\/a>/, ''),
                                                )}
                                                <Link
                                                    href={`/soeez-blog/${post.node.slug}`}
                                                >
                                                    continuer la lecture...
                                                </Link>
                                            </div>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                        {(posts.pageInfo.hasNextPage ||
                            posts.pageInfo.hasPreviousPage) && (
                            <ReactPaginate
                                previousLabel={
                                    <div className={stylesPagination.paginationNav}>
                                        <NavigateBefore />
                                    </div>
                                }
                                nextLabel={
                                    <div className={stylesPagination.paginationNav}>
                                        <NavigateNext />
                                    </div>
                                }
                                breakLabel=""
                                pageCount={pageCount}
                                marginPagesDisplayed={0}
                                pageRangeDisplayed={0}
                                onPageChange={handlePageClick}
                                containerClassName={stylesPagination.pagination}
                                activeClassName={stylesPagination.paginationActive}
                                activeLinkClassName={
                                    stylesPagination.paginationActiveLink
                                }
                                previousClassName={stylesPagination.paginationPrevious}
                                nextClassName={stylesPagination.paginationNext}
                                disabledClassName={stylesPagination.paginationDisabled}
                            />
                        )}
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

SoeezBlog.propTypes = {
    posts: PropTypes.object.isRequired,
    brands: PropTypes.array.isRequired,
    actionGetPostsNext: PropTypes.func.isRequired,
    actionGetPostsPrevious: PropTypes.func.isRequired,
    dataGetPostsNext: PropTypes.any,
    errorGetPostsNext: PropTypes.any,
    dataGetPostsPrevious: PropTypes.any,
    errorGetPostsPrevious: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        dataGetPostsNext: state.post.dataGetPostsNext,
        errorGetPostsNext: state.post.errorGetPostsNext,
        dataGetPostsPrevious: state.post.dataGetPostsPrevious,
        errorGetPostsPrevious: state.post.errorGetPostsPrevious,
        isLoading: state.post.isLoading,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetPostsNext,
            actionGetPostsPrevious,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SoeezBlog);

export async function getStaticProps() {
    let posts = await getPosts();
    posts = posts.data.posts;
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    return {
        props: {
            posts,
            brands,
        },
    };
}
