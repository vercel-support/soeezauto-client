import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    CHECK_ONLINE_STATUS_ERROR,
    POST_CONTACT_EMAIL,
    POST_CONTACT_EMAIL_INIT,
    POST_CONTACT_EMAIL_OK,
    POST_CONTACT_EMAIL_ERROR,
} from 'store/actions';
import { apiStd } from 'lib/functions';

function* postContactEmail(action) {
    const url = '/contact-form';
    try {
        yield put({
            type: POST_CONTACT_EMAIL_INIT,
        });
        const data = yield call(apiStd, url, action.values);
        yield put({
            type: POST_CONTACT_EMAIL_OK,
            data,
        });
    } catch (error) {
        let data = null;
        if (error.response === undefined || error.code === 'ECONNABORTED') {
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
        } else {
            data = [
                {
                    message: error.response.data.message,
                },
            ];
        }
        yield put({
            type: POST_CONTACT_EMAIL_ERROR,
            data,
        });
    }
}

// eslint-disable-next-line func-names
export default function* contactEmail() {
    yield all([takeLatest(POST_CONTACT_EMAIL, postContactEmail)]);
}
