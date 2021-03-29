import { apiQl } from './functions';

const queryQl = `query getSegmentsModelsDetailed(
  	    $isActiveModel: Boolean!
        ){
    segments(_order: {segment: "ASC"}) {
        id
        segment
        image
        models(
            isActive: $isActiveModel
            _order: {model: "ASC"}
        ){
            id
            model
            modelYear
            brand {
                brand
            }
            versions(
                isActive: true
                _order:{ prices_price: "ASC" }
            ) {
                id
                version
          		gearbox
                prices(
                    isActive: true
                ) {
                    id
                    updatedAt
                    price
                    promo
                }
                measures {
                  	length
                  	trunk
                }
                motor {
                    power
                    fuel
                }
                performance {
                    mileageMix
                  	maxSpeed
                }
            }
        }
    }
}`;

const variables = {
    isActiveModel: true,
};

export default async function getSegmentsModelsDetailed() {
    const segmentsModels = await apiQl(queryQl, variables);
    return segmentsModels;
}
