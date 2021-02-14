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
    trims: ['/api/trims/37', '/api/trims/38', '/api/trims/204', '/api/trims/250'],
    isActive: true,
};

export default async function getModelsWithAirCondAuto() {
    const modelsWithAirCondAuto = await apiQl(queryQl, variables);
    return modelsWithAirCondAuto;
}
