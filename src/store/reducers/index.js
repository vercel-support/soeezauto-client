import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import brand from './brand';
import contactEmail from './contact-email';
import model from './model';
import onlineStatus from './onlineStatus';
import post from './post';
import system from './system';

const rootReducer = combineReducers({
    form: formReducer,
    brand,
    contactEmail,
    model,
    onlineStatus,
    post,
    system,
});

export default rootReducer;
