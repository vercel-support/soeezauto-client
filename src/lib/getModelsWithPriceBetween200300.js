import { apiQl } from './functions';

const queryQl = `query getModelsWithPriceBetween200300(
    $isActive: Boolean!
    $isActiveVersion: Boolean!
    $isActivePrice: Boolean!
  	$gte: String!
    $lt: String!
) {
    models(
        isActive: $isActive
        versions_isActive: $isActiveVersion
        versions_prices_price: {gte: $gte, lt: $lt}
        versions_prices_isActive: $isActivePrice
    ){
    	id
    	model
  		isActive
    	versions(isActive: $isActiveVersion){
      	    version
      	    isActive
            prices(
                price: {gte: $gte, lt: $lt}
                isActive: $isActivePrice
            ){
                price
        	    isActive
            }
        }
    }
  }`;

const variables = {
    isActive: true,
    isActiveVersion: true,
    isActivePrice: true,
    gte: '200000',
    lt: '300000',
};

export default async function getModelsWithPriceBetween200300() {
    const modelsWithPriceBetween200300 = await apiQl(queryQl, variables);
    return modelsWithPriceBetween200300;
}
