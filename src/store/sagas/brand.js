import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    CLIENT_LOG,
    LOGOUT_TOKEN_EXPIRED,
    CHECK_ONLINE_STATUS_ERROR,
    GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND,
    // GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_INIT,
    GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_OK,
    GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_ERROR,
    GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND,
    GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_OK,
    GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_ERROR,
    GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND,
    GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_OK,
    GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_ERROR,
    GET_MODELS_WITH_FUEL_FOR_BRAND,
    GET_MODELS_WITH_FUEL_FOR_BRAND_OK,
    GET_MODELS_WITH_FUEL_FOR_BRAND_ERROR,
    GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND,
    GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_OK,
    GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_ERROR,
    GET_MODELS_WITH_POWER_RANGE_FOR_BRAND,
    GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_OK,
    GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_ERROR,
    GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND,
    GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_OK,
    GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_ERROR,
} from 'store/actions';
import { apiQl, errorParserGraphql } from 'lib/functions';
import {
    TRIMS_AIR_COND_AUTO,
    TRIMS_DISPLAY_MULTIMEDIA,
    TRIMS_LEATHER_SEATS,
} from 'parameters';

function* getModelsWithAutomaticGearboxForBrand(action) {
    const queryQl = `query getModelsWithAutomaticGearboxForBrand(
        $isActive: Boolean!
	    $gearbox: [String]!
        $brand: String!
    ) {
        models(
            isActive: $isActive
      	    brand: $brand
            versions_gearbox_list: $gearbox
        ){
    	    id
        }
    }`;

    const variables = {
        isActive: action.values.isActive,
        gearbox: action.values.gearbox,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getModelsWithAirCondAutoForBrand(action) {
    const queryQl = `query getModelsWithAirCondAutoForBrand(
        $brand: String!
        $isActive: Boolean!
        $trims: [String!]
    ) {
        models(
            brand: $brand
            isActive: $isActive
            versions_trims_list:$trims
        )
            {
    	        id
            }
    }`;

    const variables = {
        isActive: action.values.isActive,
        trims: TRIMS_AIR_COND_AUTO,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getModelsWithDisplayMultimediaForBrand(action) {
    const queryQl = `query getModelsWithDisplayMultimedia(
        $brand: String!
        $isActive: Boolean!
        $trims: [String!]
    ) {
        models(
            brand: $brand
            isActive: $isActive
            versions_trims_list:$trims)
            {
    	        id
            }
    }`;

    const variables = {
        isActive: action.values.isActive,
        trims: TRIMS_DISPLAY_MULTIMEDIA,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getModelsWithFuelForBrand(action) {
    const queryQl = `query getModelsWithFuel(
        $brand: String!
        $isActive: Boolean!
	    $fuel: String!
    ) {
    models(
        brand: $brand
        isActive: $isActive
        versions_motor_fuel:$fuel){
    	    id
        }
    }`;

    const variables = {
        fuel: action.values.fuel,
        isActive: action.values.isActive,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_FUEL_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_FUEL_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_FUEL_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getModelsWithLeatherSeatsForBrand(action) {
    const queryQl = `query getModelsWithLeatherSeats(
        $brand: String!
        $isActive: Boolean!
        $trims: [String!]
    ) {
        models(
            brand: $brand
            isActive: $isActive
            versions_trims_list:$trims
        )
            {
    	        id
            }
    }`;

    const variables = {
        isActive: action.values.isActive,
        trims: TRIMS_LEATHER_SEATS,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getModelsWithPowerRangeForBrand(action) {
    const queryQl = `query getModelsWithPowerRange(
        $brand: String!
        $isActive: Boolean!
	    $gte: String!
        $lt: String!
    ) {
        models(
            brand: $brand
            isActive: $isActive
            versions_motor_power:{gte: $gte, lt: $lt})
        {
    	    id
        }
    }`;

    const variables = {
        gte: action.values.min,
        lt: action.values.max,
        isActive: action.values.isActive,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_POWER_RANGE_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getModelsWithPriceRangeForBrand(action) {
    const queryQl = `query getModelsWithPriceRangeForBrand(
        $brand: String!
        $isActive: Boolean!
        $isActiveVersion: Boolean!
        $isActivePrice: Boolean!
        $gte: String!
        $lt: String
    ) {
        models(
            brand: $brand
            isActive: $isActive
            versions_isActive: $isActiveVersion
            versions_prices_price: {gte: $gte, lt: $lt}
            versions_prices_isActive: $isActivePrice
        ){
            id
            model
            isActive
            versions(isActive: $isActiveVersion){
                version
                isActive
                prices(
                    price: {gte: $gte, lt: $lt}
                    isActive: $isActivePrice
                ){
                    price
                    isActive
                }
            }
        }
    }`;

    const variables = {
        gte: action.values.min,
        lt: action.values.max,
        isActive: action.values.isActive,
        isActiveVersion: true,
        isActivePrice: true,
        brand: action.values.brand,
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND,
                },
            });
        } else {
            yield put({
                type: GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_OK,
                data: data.data.models,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

// eslint-disable-next-line func-names
export default function* brand() {
    yield all([
        takeLatest(
            GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND,
            getModelsWithAutomaticGearboxForBrand,
        ),
        takeLatest(
            GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND,
            getModelsWithAirCondAutoForBrand,
        ),
        takeLatest(
            GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND,
            getModelsWithDisplayMultimediaForBrand,
        ),
        takeLatest(GET_MODELS_WITH_FUEL_FOR_BRAND, getModelsWithFuelForBrand),
        takeLatest(
            GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND,
            getModelsWithLeatherSeatsForBrand,
        ),
        takeLatest(
            GET_MODELS_WITH_POWER_RANGE_FOR_BRAND,
            getModelsWithPowerRangeForBrand,
        ),
        takeLatest(
            GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND,
            getModelsWithPriceRangeForBrand,
        ),
    ]);
}
