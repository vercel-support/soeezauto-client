import { apiQl } from './functions';

const queryQl = `query getModelsWithPriceHigherThan400(
    $isActive: Boolean!
    $isActiveVersion: Boolean!
    $isActivePrice: Boolean!
  	$gte: String!
) {
    models(
        isActive: $isActive
        versions_isActive: $isActiveVersion
        versions_prices_price: {gte: $gte}
        versions_prices_isActive: $isActivePrice
    ){
    	id
    	model
  		isActive
    	versions(isActive: $isActiveVersion){
      	    version
      	    isActive
            prices(
                price: {gte: $gte}
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
    gte: '400000',
};

export default async function getModelsWithPriceHigherThan400() {
    const modelsWithPriceHigherThan400 = await apiQl(queryQl, variables);
    return modelsWithPriceHigherThan400;
}
