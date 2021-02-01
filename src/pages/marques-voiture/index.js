import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getBrands from 'lib/getBrands';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const Brands = (props) => {
    console.log('brands', props);
    const { brands } = props;
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {brands.map((brand) => (
                    <Link
                        key={brand.brand}
                        href={`${
                            process.env.NEXT_PUBLIC_CLIENT_HOST
                        }/marques-voiture/${urlWriter(brand.brand)}`}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                            alt={brand.brand}
                            width="40"
                            height="40"
                            loading="eager"
                            priority
                        />
                    </Link>
                ))}
            </main>
        </div>
    );
};

Brands.propTypes = {
    brands: PropTypes.array.isRequired,
};

export default Brands;

export async function getStaticProps() {
    let brands = await getBrands();
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
