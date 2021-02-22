import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import { apiQl } from 'lib/functions';
import { priceRanges } from 'parameters';

const Price = (props) => {
    const { versions } = props;
    console.log('versions', versions);
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div>price range</div>
            </main>
        </div>
    );
};

Price.propTypes = {
    versions: PropTypes.array.isRequired,
};

export default Price;

const queryQl = `query getRange(
  	$isActiveModel: Boolean!
  	$range: String
) {
        versions(
          exists: {prices:true}
          model_isActive: $isActiveModel
        ) {
            id
            version
            prices(
              	price: {between: $range}
                _order: {updatedAt: "DESC"}
                first: 1
            ) {
            	edges {
                    node {
                        id
                        updatedAt
                        price
                        promo
                    }
                } 
            }
        }
    }`;

export async function getStaticPaths() {
    const paths = [];
    priceRanges.forEach((rang) => {
        paths.push({
            params: {
                range: `${rang[0]}-${rang[1]}/dh`,
            },
        });
    });
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const { range: rangeParam } = params;
    console.log('params', params);
    let posts = await getPosts();
    posts = posts.data.posts;
    const variables = {
        range: rangeParam.replace('-', '..'),
        isActiveModel: true,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            versions: data.data.versions,
            posts,
        },
    };
}
