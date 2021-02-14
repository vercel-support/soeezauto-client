import { apiQl } from './functions';

const queryQl = `query getSegments(
  	    $isActiveModel: Boolean!
        $imageIsFeatured: Boolean!
        ){
    segments(_order: {segment: "ASC"}) {
        id
        segment
        image
        models(
            isActive: $isActiveModel
            _order: {model: "ASC"}
        ){
            id
            model
            modelYear
            images(isFeatured: $imageIsFeatured) {
                filename
            }
            segment {
                id
                segment
            }
        }
    }
}`;

const variables = {
    isActiveModel: true,
    imageIsFeatured: true,
};

export default async function getSegmentsModels() {
    const segmentsModels = await apiQl(queryQl, variables);
    return segmentsModels;
}
