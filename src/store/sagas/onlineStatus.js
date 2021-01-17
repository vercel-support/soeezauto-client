import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    CHECK_ONLINE_STATUS,
    CHECK_ONLINE_STATUS_OK,
    CHECK_ONLINE_STATUS_ERROR,
} from 'store/actions';
import { api } from './functions';

function* getCheckOnlineStatus() {
    const url = `${process.env.NEXT_PUBLIC_CLIENT_HOST}/icons/icon-48x48.png`;
    try {
        yield call(api, 'get', url, null, 'favicon', false);
        yield put({
            type: CHECK_ONLINE_STATUS_OK,
            isOnline: true,
        });
        // clears indexedDB offline event flag
        localforage.removeItem('offline-event-fired');
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (isOffline) {
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
        yield put({
            type: CHECK_ONLINE_STATUS_ERROR,
            isOnline: !isOffline,
        });
    }
}

// eslint-disable-next-line func-names
export default function* onlineStatus() {
    yield all([takeLatest(CHECK_ONLINE_STATUS, getCheckOnlineStatus)]);
}
