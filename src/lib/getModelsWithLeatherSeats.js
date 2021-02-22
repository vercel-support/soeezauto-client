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
    trims: ['/api/trims/115', '/api/trims/283', '/api/trims/540'],
    isActive: true,
};

export default async function getModelsWithLeatherSeats() {
    const modelsWithLeatherSeats = await apiQl(queryQl, variables);
    return modelsWithLeatherSeats;
}
