import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getBrands from 'lib/getBrands';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';

const Brand = (props) => {
    console.log('brand props', props);
    const { brand } = props;

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/brands/${brand.image}`}
                    alt={brand.brand}
                    width="40"
                    height="40"
                    loading="eager"
                    priority
                />
            </main>
        </div>
    );
};

Brand.propTypes = {
    brand: PropTypes.object.isRequired,
};

export default Brand;

const queryQl = `query getBrand(
  	    $id: ID!
		$isActiveModel: Boolean!) {
        brand(id: $id) {
		    id
		    brand
            image
            models(isActive: $isActiveModel){
                id
                model
                modelYear
                images {
                    id
                    filename
                }
                segment {
                    id
                    segment
                }
            }
        }
    }`;

export async function getStaticPaths() {
    let brands = await getBrands();
    brands = brands.data.brands;
    const paths = [];
    brands.forEach((brand) => {
        paths.push({
            params: {
                brand: urlWriter(brand.brand),
            },
        });
    });
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { brand: brandParam } = params;
    let brands = await getBrands();
    brands = brands.data.brands;
    let posts = await getPosts();
    posts = posts.data.posts;
    const brandFilter = brands.filter((br) => {
        return urlWriter(br.brand) === brandParam;
    });
    const variables = {
        id: brandFilter[0].id,
        isActiveModel: true,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            brand: data.data.brand,
            posts,
        },
    };
}
