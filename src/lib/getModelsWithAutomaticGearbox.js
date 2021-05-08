import { AUTOMATIC_GEARBOXES } from 'parameters';
import { apiQl } from './functions';

const queryQl = `query getModelsWithAutomaticGearbox(
    $isActive: Boolean!
	$gearbox: [String]!
) {
    models(
        isActive: $isActive
        versions_gearbox_list: $gearbox){
    	    id
        }
  }`;

const variables = {
    gearbox: AUTOMATIC_GEARBOXES,
    isActive: true,
};

export default async function getModelsWithAutomaticGearbox() {
    const modelsWithAutomaticGearbox = await apiQl(queryQl, variables);
    return modelsWithAutomaticGearbox;
}
