import { apiQl } from './functions';

const queryQl = `query getBrandsModels(
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
                versions(exists: {prices:true}) {
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
                }
            }
        }
    }`;

const variables = {
    isActive: true,
    isActiveModel: true,
    imageIsFeatured: true,
};

export default async function getBrandsModels() {
    const brandsModels = await apiQl(queryQl, variables);
    return brandsModels;
}
