import { apiQl } from './functions';

const queryQl = `query getSegments(
  	    $isActive: Boolean!){
    segments(_order: {segment: "ASC"}) {
        id
        segment
        image
        models(isActive: $isActive) {
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

const variables = {
    isActive: true,
};

export default async function getSegmentsModels() {
    const segmentsModels = await apiQl(queryQl, variables);
    return segmentsModels;
}
