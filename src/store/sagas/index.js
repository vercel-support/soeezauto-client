import { all } from 'redux-saga/effects';
import admin from './admin';
import brand from './brand';
import contactEmail from './contact-email';
import model from './model';
import onlineStatus from './onlineStatus';

export default function* rootSaga() {
    yield all([admin(), brand(), contactEmail(), model(), onlineStatus()]);
}
