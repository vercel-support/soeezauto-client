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
    isActive: true,
    isActiveModel: true,
    imageIsFeatured: true,
};

export default async function getBrandsModels() {
    const brandsModels = await apiQl(queryQl, variables);
    return brandsModels;
}
