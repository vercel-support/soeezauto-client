import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getSegments from 'lib/getSegments';
import getPosts from 'lib/getPosts';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const Segments = (props) => {
    console.log('segments', props);
    const { segments } = props;
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {segments.map((segment) => (
                    <Link
                        key={segment.segment}
                        href={`${
                            process.env.NEXT_PUBLIC_CLIENT_HOST
                        }/segments-automobile/${urlWriter(segment.segment)}`}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/segments/${segment.image}`}
                            alt={segment.segment}
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

Segments.propTypes = {
    segments: PropTypes.array.isRequired,
};

export default Segments;

export async function getStaticProps() {
    let segments = await getSegments();
    segments = segments.data.segments;
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            segments,
            posts,
        },
    };
}
