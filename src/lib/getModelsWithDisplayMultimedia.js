import { TRIMS_DISPLAY_MULTIMEDIA } from 'parameters';
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
    trims: TRIMS_DISPLAY_MULTIMEDIA,
    isActive: true,
};

export default async function getModelsWithDisplayMultimedia() {
    const modelsWithDisplayMultimedia = await apiQl(queryQl, variables);
    return modelsWithDisplayMultimedia;
}
