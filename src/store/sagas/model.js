import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    CLIENT_LOG,
    LOGOUT_TOKEN_EXPIRED,
    CHECK_ONLINE_STATUS_ERROR,
    GET_MODEL_VERSIONS_WITH_TRIMS,
    GET_MODEL_VERSIONS_WITH_TRIMS_OK,
    GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
    GET_PREVIOUS_MODELS,
    GET_PREVIOUS_MODELS_INIT,
    GET_PREVIOUS_MODELS_OK,
    GET_PREVIOUS_MODELS_ERROR,
    GET_MODEL,
    GET_MODEL_INIT,
    GET_MODEL_OK,
    GET_MODEL_ERROR,
} from 'store/actions';
import { apiQl, errorParserGraphql } from 'lib/functions';

function* getModelVersionsWithTrims(action) {
    const queryQl = `query getModelVersionsWithTrims(
        $modelId: String!
        $isActive: Boolean!
        $trims: [String!]
    ) {
        versions(
            model: $modelId,
            isActive: $isActive
            trims_list:$trims
        )   {
    	        id
            }
    }`;

    const variables = {
        modelId: action.values.modelId,
        isActive: true,
        trims: [...action.values.trims],
    };
    try {
        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODEL_VERSIONS_WITH_TRIMS,
                },
            });
        } else {
            yield put({
                type: GET_MODEL_VERSIONS_WITH_TRIMS_OK,
                data: data.data.versions,
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

function* getPreviousModels(action) {
    const queryQl = `query getPreviousModels(
        $model: String!
    ){
        models(
            isActive: false
            _order: {createdAt: "DESC"}
            model: $model
        ){
            id
            model
            versions(
                _order:{prices_price: "ASC"}
            ) {
                id
                version
                prices(
                    _order: {updatedAt: "DESC"}
                ) {
                    id
                    updatedAt
                    price
                    promo
                    isActive
                }
            }
        }
    }`;

    const variables = {
        model: action.values.model,
    };
    try {
        yield put({
            type: GET_PREVIOUS_MODELS_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_PREVIOUS_MODELS_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_PREVIOUS_MODELS,
                },
            });
        } else {
            yield put({
                type: GET_PREVIOUS_MODELS_OK,
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

function* getModel(action) {
    const queryQl = `query getModel(
        $id: ID!
        $after: String!
    ) {
        model(id: $id) {
            id
            model
            modelYear
            images(isFeatured: true) {
                filename
            }
            brand {
                id
                brand
                image
            }
            segment {
                id
                segment
            }
            specs(
                first: 1, after: null,
              	_order: {updatedAt: "DESC"}
              	updatedAt: {after: $after}
            ) {
                edges {
                    node {
                        id
                        filename
                        updatedAt
                    }
                }
            }
            versions(
                isActive: true
                _order:{ bodyType: "ASC", motor_fuel: "ASC", prices_price: "ASC"}
            ){
                id
                version
                taxLuxe
                matricule
                tag
                paintMetal
                destCharges
                gearbox
                places
                doors
                curbWeight
                gvw
                traction
                tyreFr
                tyreBk
                prices(
                    _order: {updatedAt: "DESC"}
                ) {
                    id
                    updatedAt
                    price
                    promo
                    isActive
                }
                CF {
                    CF
                }
                motor {
                    power
                    fuel
                    cc
                    cylinder
                    torque
                    valves
                    aspiration
                }
                measures {
                    fuelTank
                    width
                    height
                    length
                    wheelbase
                    trunk
                    trunkMax
                }
                performance {
                    to100
                    maxSpeed
                    emissions
                    mileageCity
                    mileageRoad
                    mileageMix
                }
                trims(_order: { trim: "ASC"}) {
                    id
                    trim
                    trimType
                }
            }
        }
    }`;

    const getAfter = () => {
        const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        firstOfMonth.setDate(firstOfMonth.getDate() - 90);
        return `${firstOfMonth.getFullYear()}-${firstOfMonth.getMonth() - 1}-1`;
    };

    const variables = {
        id: action.modelId,
        after: getAfter(),
    };
    try {
        yield put({
            type: GET_MODEL_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_MODEL_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_MODEL,
                },
            });
        } else {
            yield put({
                type: GET_MODEL_OK,
                data: data.data.model,
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
export default function* model() {
    yield all([
        takeLatest(GET_MODEL_VERSIONS_WITH_TRIMS, getModelVersionsWithTrims),
        takeLatest(GET_PREVIOUS_MODELS, getPreviousModels),
        takeLatest(GET_MODEL, getModel),
    ]);
}
