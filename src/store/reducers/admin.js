import { HYDRATE } from 'next-redux-wrapper';
import {
    POST_CLIENT_LOG_INIT,
    POST_CLIENT_LOG_OK,
    POST_CLIENT_LOG_ERROR,
} from '../actions';

const initialState = {
    dataPostClientLog: null,
    errorPostClientLog: null,
};

const admin = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case POST_CLIENT_LOG_INIT:
            return {
                ...state,
                dataPostClientLog: null,
                errorPostClientLog: null,
            };
        case POST_CLIENT_LOG_OK:
            return {
                ...state,
                dataPostClientLog: action.data,
            };
        case POST_CLIENT_LOG_ERROR:
            return {
                ...state,
                errorPostClientLog: action.data,
            };
        default:
            return state;
    }
};

export default admin;
