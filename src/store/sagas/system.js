import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
    POST_CLIENT_LOG,
    POST_CLIENT_LOG_INIT,
    POST_CLIENT_LOG_OK,
    POST_CLIENT_LOG_ERROR,
} from 'store/actions';
import { apiQl, errorParserGraphql } from '../../lib/functions';

function* postClientLog(action) {
    const queryQl = `mutation postClientLog(
            $url: String!
            $message: String!
            $action: String
    ){
        createClientLog(
            input:{
                url: $url
                message: $message
                action: $action
            }
        ) {
            clientLog{
                id
            }
        }
    }`;

    const variables = {
        url: action.values.url,
        message: action.values.message,
        action: action.values.action || null,
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
        console.log('log error', error.response);
    }
}

// eslint-disable-next-line func-names
export default function* system() {
    yield all([takeLatest(POST_CLIENT_LOG, postClientLog)]);
}
