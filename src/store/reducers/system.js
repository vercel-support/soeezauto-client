import { HYDRATE } from 'next-redux-wrapper';
import {
    ADD_TO_URL_HISTORY,
    CLIENT_LOG,
    POST_CLIENT_LOG_INIT,
    POST_CLIENT_LOG_OK,
    POST_CLIENT_LOG_ERROR,
    SET_CLIENT_LOG_TO_NULL,
} from '../actions';

const initialState = {
    history: [],
    dataClientLog: null,
    dataPostClientLog: null,
    errorPostClientLog: null,
};

const system = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case ADD_TO_URL_HISTORY:
            return {
                ...state,
                history: [...state.history, action.url],
            };
        case CLIENT_LOG:
            return {
                ...state,
                dataClientLog: action.data,
            };
        case SET_CLIENT_LOG_TO_NULL:
            return {
                ...state,
                dataClientLog: null,
            };
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

export default system;
