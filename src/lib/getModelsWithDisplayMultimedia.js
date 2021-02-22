import { apiQl } from './functions';

const queryQl = `query getModelsWithDisplayMultimedia(
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
    trims: ['/api/trims/272', '/api/trims/462'],
    isActive: true,
};

export default async function getModelsWithDisplayMultimedia() {
    const modelsWithDisplayMultimedia = await apiQl(queryQl, variables);
    return modelsWithDisplayMultimedia;
}
