import { apiQl } from './functions';

const queryQl = `query getSegments{
    segments(_order: {segment: "ASC"}) {
        id
        segment
        image
    }
}`;

export default async function getSegmentsModels() {
    const segments = await apiQl(queryQl, null);
    return segments;
}
