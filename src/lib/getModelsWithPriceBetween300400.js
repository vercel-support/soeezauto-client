import { apiQl } from './functions';

const queryQl = `query getModelsWithPriceBetween300400(
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
    gte: '300000',
    lt: '400000',
};

export default async function getModelsWithPriceBetween300400() {
    const modelsWithPriceBetween300400 = await apiQl(queryQl, variables);
    return modelsWithPriceBetween300400;
}
