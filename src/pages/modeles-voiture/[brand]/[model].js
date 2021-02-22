import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';

const Model = (props) => {
    console.log('MODEL props', props);
    const { model } = props;

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                    alt={model.model}
                    width="300"
                    height="200"
                    loading="eager"
                    priority
                />
            </main>
        </div>
    );
};

Model.propTypes = {
    model: PropTypes.object.isRequired,
};

export default Model;

const queryQl = `query getModel(
  	$id: ID!
) {
    model(id: $id) {
        id
    	model
    	modelYear
    	images(isFeatured: true) {
            filename
        }
    	brand {
            id
            brand
        }
        segment {
            id
            segment
        }
        versions(exists: {prices:true}) {
            id
            version
            prices(
                _order: {updatedAt: "DESC"}
            ) {
                id
                updatedAt
                price
                promo
            }
        }
    }
}`;

export async function getStaticPaths() {
    let models = await getModels();
    models = models.data.models;
    const paths = [];
    models.forEach((model) => {
        paths.push({
            params: {
                brand: urlWriter(model.brand.brand),
                model: urlWriter(model.model),
            },
        });
    });
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    console.log('PARAMS', params);
    const { model: modelParam } = params;
    let models = await getModels();
    console.log('MODELS', models);
    models = models.data.models;
    let posts = await getPosts();
    posts = posts.data.posts;
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === modelParam;
    });
    console.log('MODEL FILTER', modelFilter);
    const variables = {
        id: modelFilter[0].id,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            model: data.data.model,
            posts,
        },
    };
}
