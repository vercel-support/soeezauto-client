import { apiQl } from './functions';

const queryQl = `query getModelsWithPowerBetween150200(
    $isActive: Boolean!
	$gte: String!
    $lt: String!
) {
    models(
        isActive: $isActive
        versions_motor_power:{gte: $gte, lt: $lt}){
    	    id
        }
  }`;

const variables = {
    gte: '150',
    lt: '200',
    isActive: true,
};

export default async function getModelsWithPowerBetween150200() {
    const modelsWithPowerBetween150200 = await apiQl(queryQl, variables);
    return modelsWithPowerBetween150200;
}
