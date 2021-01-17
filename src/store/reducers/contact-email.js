import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_CONTACT_EMAIL_INIT,
    POST_CONTACT_EMAIL_OK,
    POST_CONTACT_EMAIL_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    dataPostContactEmail: null,
    errorPostContactEmail: null,
};

const contactEmail = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case POST_CONTACT_EMAIL_INIT:
            return {
                ...state,
                isLoading: true,
                errorPostContactEmail: null,
                dataPostContactEmail: null,
            };
        case POST_CONTACT_EMAIL_OK:
            return {
                ...state,
                isLoading: false,
                dataPostContactEmail: action.data,
            };
        case POST_CONTACT_EMAIL_ERROR:
            return {
                ...state,
                isLoading: false,
                errorPostContactEmail: action.data,
            };
        default:
            return state;
    }
};

export default contactEmail;
