import { TRIMS_AIR_COND_AUTO } from 'parameters';
import { apiQl } from './functions';

const queryQl = `query getModelsWithAirCondAuto(
  $isActive: Boolean!
  $trims: [String!]
) {
    models(
      isActive: $isActive
      versions_trims_list:$trims){
    	id
    }
  }`;

const variables = {
    trims: TRIMS_AIR_COND_AUTO,
    isActive: true,
};

export default async function getModelsWithAirCondAuto() {
    const modelsWithAirCondAuto = await apiQl(queryQl, variables);
    return modelsWithAirCondAuto;
}
