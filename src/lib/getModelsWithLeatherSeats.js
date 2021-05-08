import { TRIMS_LEATHER_SEATS } from 'parameters';
import { apiQl } from './functions';

const queryQl = `query getModelsWithLeatherSeats(
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
    trims: TRIMS_LEATHER_SEATS,
    isActive: true,
};

export default async function getModelsWithLeatherSeats() {
    const modelsWithLeatherSeats = await apiQl(queryQl, variables);
    return modelsWithLeatherSeats;
}
