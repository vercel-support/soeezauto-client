import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_MODEL_VERSIONS_WITH_TRIMS_OK,
    GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
} from '../actions';

const initialState = {
    dataGetModelVersionsWithTrims: null,
    errorGetModelVersionsWithTrims: null,
    isLoading: false,
};

const model = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case GET_MODEL_VERSIONS_WITH_TRIMS_OK:
            return {
                ...state,
                dataGetModelVersionsWithTrims: action.data,
            };
        case GET_MODEL_VERSIONS_WITH_TRIMS_ERROR:
            return {
                ...state,
                errorGetModelVersionsWithTrims: action.data,
            };
        default:
            return state;
    }
};

export default model;
