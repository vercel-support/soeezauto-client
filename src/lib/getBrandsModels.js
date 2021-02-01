import { apiQl } from './functions';

const queryQl = `query getBrandsModels(
  	    $isActive: Boolean!,
		$isActiveModel: Boolean!) {
    brands(
        isActive: $isActive) {
		    id
		    brand
            image
            models(isActive: $isActiveModel){
                id
                model
                modelYear
                images {
                    id
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
};

export default async function getBrandsModels() {
    const brandsModels = await apiQl(queryQl, variables);
    return brandsModels;
}
