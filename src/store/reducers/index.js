import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import admin from './admin';
import brand from './brand';
import contactEmail from './contact-email';
import model from './model';
import onlineStatus from './onlineStatus';

const rootReducer = combineReducers({
    form: formReducer,
    admin,
    brand,
    contactEmail,
    model,
    onlineStatus,
});

export default rootReducer;
