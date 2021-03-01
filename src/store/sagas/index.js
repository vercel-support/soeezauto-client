import { all } from 'redux-saga/effects';
import contactEmail from './contact-email';
import model from './model';
import onlineStatus from './onlineStatus';

export default function* rootSaga() {
    yield all([contactEmail(), model(), onlineStatus()]);
}
