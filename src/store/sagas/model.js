import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    LOGOUT_TOKEN_EXPIRED,
    CHECK_ONLINE_STATUS_ERROR,
    GET_MODEL_VERSIONS_WITH_TRIMS,
    GET_MODEL_VERSIONS_WITH_TRIMS_OK,
    GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
    GET_PREVIOUS_MODELS,
    GET_PREVIOUS_MODELS_INIT,
    GET_PREVIOUS_MODELS_OK,
    GET_PREVIOUS_MODELS_ERROR,
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

// eslint-disable-next-line func-names
export default function* contactEmail() {
    yield all([
        takeLatest(GET_MODEL_VERSIONS_WITH_TRIMS, getModelVersionsWithTrims),
        takeLatest(GET_PREVIOUS_MODELS, getPreviousModels),
    ]);
}
