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
    gearbox: ['a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'cvt'],
    isActive: true,
};

export default async function getModelsWithAutomaticGearbox() {
    const modelsWithAutomaticGearbox = await apiQl(queryQl, variables);
    return modelsWithAutomaticGearbox;
}
