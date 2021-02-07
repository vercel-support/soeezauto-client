import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const Promotions = (props) => {
    console.log('models', props);
    const { models } = props;
    const promos = [];
    models.forEach((model) => {
        const promoVersions = model.versions.filter((version) => {
            return version.prices.edges[0].node.promo;
        });
        if (promoVersions.length > 0) {
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            promos.push(model);
        }
    });
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {promos.map((model) => (
                    <Link
                        key={model.model}
                        href={`${
                            process.env.NEXT_PUBLIC_CLIENT_HOST
                        }/modeles-voiture/${urlWriter(model.brand.brand)}/${urlWriter(
                            model.model,
                        )}`}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                            alt={`${model.brand.brand}-${model.model}`}
                            width="100"
                            height="67"
                            loading="eager"
                            priority
                        />
                    </Link>
                ))}
            </main>
        </div>
    );
};

Promotions.propTypes = {
    models: PropTypes.array.isRequired,
};

export default Promotions;

export async function getStaticProps() {
    let models = await getModels();
    models = models.data.models;
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            models,
            posts,
        },
    };
}
