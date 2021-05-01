import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getSegments from 'lib/getSegments';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';

const Segment = (props) => {
    console.log('segment props', props);
    const { segment } = props;

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/segments/${segment.image}`}
                    alt={segment.segment}
                    width="300"
                    height="200"
                    loading="eager"
                    priority
                />
            </main>
        </div>
    );
};

Segment.propTypes = {
    segment: PropTypes.object.isRequired,
};

export default Segment;

const queryQl = `query getSegment(
  		$id: ID!
  	    $isActiveModel: Boolean!){
    segment(id: $id) {
        id
        segment
        image
        models(isActive: $isActiveModel) {
            id
            model
            modelYear
            brand {
                id
                brand
            }
        }
    }
}`;

export async function getStaticPaths() {
    let segments = await getSegments();
    segments = segments.data.segments;
    const paths = [];
    segments.forEach((segment) => {
        paths.push({
            params: {
                segment: urlWriter(segment.segment),
            },
        });
    });
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { segment: segmentParam } = params;
    let segments = await getSegments();
    segments = segments.data.segments;
    let posts = await getPosts();
    posts = posts.data.posts;
    const segmentFilter = segments.filter((seg) => {
        return urlWriter(seg.segment) === segmentParam;
    });
    const variables = {
        id: segmentFilter[0].id,
        isActiveModel: true,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            segment: data.data.segment,
            posts,
        },
    };
}
