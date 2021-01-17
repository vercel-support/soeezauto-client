import { all } from 'redux-saga/effects';
import contactEmail from './contact-email';
import onlineStatus from './onlineStatus';

export default function* rootSaga() {
    yield all([contactEmail(), onlineStatus()]);
}
