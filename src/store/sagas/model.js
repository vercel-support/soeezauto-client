import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    LOGOUT_TOKEN_EXPIRED,
    CHECK_ONLINE_STATUS_ERROR,
    GET_MODEL_VERSIONS_WITH_TRIMS,
    GET_MODEL_VERSIONS_WITH_TRIMS_OK,
    GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
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

// eslint-disable-next-line func-names
export default function* contactEmail() {
    yield all([takeLatest(GET_MODEL_VERSIONS_WITH_TRIMS, getModelVersionsWithTrims)]);
}
