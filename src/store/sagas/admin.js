import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    LOGOUT_TOKEN_EXPIRED,
    CHECK_ONLINE_STATUS_ERROR,
    POST_CLIENT_LOG,
    POST_CLIENT_LOG_INIT,
    POST_CLIENT_LOG_OK,
    POST_CLIENT_LOG_ERROR,
} from 'store/actions';
import { apiQl, errorParserGraphql } from 'lib/functions';

function* postClientLog(action) {
    const queryQl = `mutation postClientLog(
        $url: String!
        $action: String
        $message: String!
    ) {
        createClientLog(
            input: {
                url: $url
                action: $action
                message: $message
            }
        ){
            clientLog{
                id
            }
        }
    }`;

    const variables = {
        url: action.values.url,
        action: action.values.action,
        message: action.values.message,
    };
    try {
        yield put({
            type: POST_CLIENT_LOG_INIT,
        });

        const data = yield call(apiQl, queryQl, variables);
        if (data.errors) {
            yield put({
                type: POST_CLIENT_LOG_ERROR,
                data: errorParserGraphql(data.errors),
            });
        } else {
            yield put({
                type: POST_CLIENT_LOG_OK,
                data: data.data.createClientLog,
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
export default function* admin() {
    yield all([takeLatest(POST_CLIENT_LOG, postClientLog)]);
}
