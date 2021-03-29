import { apiQl } from './functions';
// TODO decide to keep it or not
const queryQl = `query getVersionsWithAirCondAuto(
    $isActive: Boolean!
    $modelIsActive: Boolean!
    $trims: [String!]
) {
    versions(
        model_isActive: $modelIsActive
        isActive: $isActive
        trims_list: $trims) {
      	id
      }
  }`;

const variables = {
    trims: ['/api/trims/37', '/api/trims/38', '/api/trims/204', '/api/trims/250'],
    isActive: true,
    modelIsActive: true,
};

export default async function getVersionsWithAirCondAuto() {
    const versionsWithAirCondAuto = await apiQl(queryQl, variables);
    return versionsWithAirCondAuto;
}
