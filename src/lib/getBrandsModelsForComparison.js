import { apiQl } from './functions';

const queryQl = `query getBrandsModelsForComparison(
    $isActive: Boolean!,
    $isActiveModel: Boolean!
    $imageIsFeatured: Boolean!
    ) {
    brands(
        isActive: $isActive
        _order: {brand: "ASC"}
        ) {
		    id
		    brand
            image
            models(
                isActive: $isActiveModel
                _order: {model: "ASC"}
            ){
                id
                model
                createdAt
                images(isFeatured: $imageIsFeatured) {
                    filename
                }
                versions(
                    exists: {prices:true}
                    isActive: true
                ) {
                    id
                    version
                    prices(
                        isActive: true
                    ) {
                        id
                        updatedAt
                        price
                        promo
                    }
                    CF {
                        CF
                    }
                    motor {
                        power
                        fuel
                    }
                }
            }
        }
    }`;

const variables = {
    isActive: true,
    isActiveModel: true,
    imageIsFeatured: true,
};

export default async function getBrandsModelsForComparison() {
    const brandsModelsForComparison = await apiQl(queryQl, variables);
    return brandsModelsForComparison;
}
