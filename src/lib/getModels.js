import { apiQl } from './functions';

const queryQl = `query getModels(
  	$isActive: Boolean!
  	$imageIsFeatured: Boolean!
) {
    models(
        isActive: $isActive
        _order: {createdAt: "DESC"}
    ) {
        id
    	model
    	modelYear
    	images(isFeatured: $imageIsFeatured) {
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
    }
}
`;

const variables = {
    isActive: true,
    imageIsFeatured: true,
};

export default async function getModels() {
    const models = await apiQl(queryQl, variables);
    return models;
}
