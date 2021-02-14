import React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getBrandsModels from 'lib/getBrandsModels';
import getPosts from 'lib/getPosts';
import TreeCard from 'components/treeCard';

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
const Brands = (props) => {
    console.log('brands', props);
    const classes = useStyles();
    const { brands } = props;
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div className={classes.catList}>
                    {brands.map((brand, ind) => (
                        <TreeCard key={brand.id} item={brand} node={ind + 1} />
                    ))}
                </div>
            </main>
        </div>
    );
};

Brands.propTypes = {
    brands: PropTypes.array.isRequired,
};

export default Brands;

export async function getStaticProps() {
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    let posts = await getPosts();
    console.log('POSTS', posts);
    posts = posts.data.posts;
    return {
        props: {
            brands,
            posts,
        },
    };
}
