import { all } from 'redux-saga/effects';
import brand from './brand';
import contactEmail from './contact-email';
import model from './model';
import onlineStatus from './onlineStatus';
import post from './post';
import system from './system';

export default function* rootSaga() {
    yield all([brand(), contactEmail(), model(), onlineStatus(), post(), system()]);
}
