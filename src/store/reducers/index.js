import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import contactEmail from './contact-email';
import model from './model';
import onlineStatus from './onlineStatus';

const rootReducer = combineReducers({
    form: formReducer,
    contactEmail,
    model,
    onlineStatus,
});

export default rootReducer;
