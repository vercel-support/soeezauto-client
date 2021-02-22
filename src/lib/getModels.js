import { apiQl } from './functions';

const queryQl = `query getModels(
  	$isActive: Boolean!
  	$imageIsFeatured: Boolean!
    $isActivePrice: Boolean!
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
                isActive: $isActivePrice
            ) {
                id
                updatedAt
                price
                promo
            }
            motor {
                power
                fuel
            }
        }
    }
}
`;

const variables = {
    isActive: true,
    imageIsFeatured: true,
    isActivePrice: true,
};

export default async function getModels() {
    const models = await apiQl(queryQl, variables);
    return models;
}
