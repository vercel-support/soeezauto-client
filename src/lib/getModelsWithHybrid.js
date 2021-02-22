import { apiQl } from './functions';

const queryQl = `query getModelsWithHybrid(
    $isActive: Boolean!
	$fuel: String!
) {
    models(
        isActive: $isActive
        versions_motor_fuel:$fuel){
    	    id
        }
  }`;

const variables = {
    fuel: 'hybrid',
    isActive: true,
};

export default async function getModelsWithHybrid() {
    const modelsWithHybrid = await apiQl(queryQl, variables);
    return modelsWithHybrid;
}
