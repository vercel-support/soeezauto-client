import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getModels from 'lib/getBrands';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { priceRanges } from 'parameters';

const Prices = (props) => {
    const { models } = props;
    console.log('models', models);

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {priceRanges.map((range) => (
                    <Link
                        key={range}
                        href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/prix-voiture/${range[0]}-${range[1]}/dh`}
                    >
                        <div>{`${range[0]}-${range[1]}`}</div>
                    </Link>
                ))}
            </main>
        </div>
    );
};

Prices.propTypes = {
    models: PropTypes.array.isRequired,
};

export default Prices;

export async function getStaticProps() {
    let models = await getModels();
    models = models.data.brands;
    let posts = await getPosts();
    console.log('POSTS', posts);
    posts = posts.data.posts;
    return {
        props: {
            models,
            posts,
        },
    };
}
