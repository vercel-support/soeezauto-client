import { apiQl } from './functions';

const queryQl = `query getBrands(
  	    $isActive: Boolean!) {
    brands(
        isActive: $isActive) {
		    id
		    brand
            image
        }
    }`;

const variables = {
    isActive: true,
};

export default async function getBrands() {
    const brands = await apiQl(queryQl, variables);
    return brands;
}
