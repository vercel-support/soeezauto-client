import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const Models = (props) => {
    console.log('models', props);
    const { models } = props;
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {models.map((model) => (
                    <Link
                        key={models.model}
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

Models.propTypes = {
    models: PropTypes.array.isRequired,
};

export default Models;

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
