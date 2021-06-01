import React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getBrandsModels from 'lib/getBrandsModels';
import getPosts from 'lib/getPosts';
import TreeCard from 'components/treeCard';
import Breadcrumb from 'components/breadcrumb';

const useStyles = makeStyles(() => ({
    catList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        gap: 10,
        '& > div': {
            flex: '0 0 280px',
            backgroundColor: '#ffe082',
        },
    },
}));
const Brands = (props) => {
    const classes = useStyles();
    const { brands } = props;
    return (
        <div>
            <Head>
                <title>
                    {`Toutes marques voitures neuves au Maroc | guide d'achat modèles, prix,
                    fiches techniques`}
                </title>
                <meta
                    name="description"
                    content="Guide d'achat, prix, fiches techniques, comparatif, nouveautés voitures neuves au Maroc "
                />
                <meta
                    property="og:title"
                    content="Marques voiture au Maroc, modèles, prix, fiches techniques"
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.com/images/brands/TODO.png"
                />
                <meta
                    property="og:url"
                    content="https://www.soeezauto.ma/marques-voiture"
                />
                <link rel="canonical" href="https://www.soeezauto.ma/marques-voiture" />
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
                            text: 'marques voiture',
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>Marques voiture au Maroc</h1>
                </div>
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
    posts = posts.data.posts;
    return {
        props: {
            brands,
            posts,
        },
    };
}
