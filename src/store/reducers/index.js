import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import contactEmail from './contact-email';
import onlineStatus from './onlineStatus';

const rootReducer = combineReducers({
    form: formReducer,
    contactEmail,
    onlineStatus,
});

export default rootReducer;
