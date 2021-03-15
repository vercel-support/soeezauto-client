import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_MODEL_VERSIONS_WITH_TRIMS_OK,
    GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
    GET_PREVIOUS_MODELS_INIT,
    GET_PREVIOUS_MODELS_OK,
    GET_PREVIOUS_MODELS_ERROR,
} from '../actions';

const initialState = {
    dataGetModelVersionsWithTrims: null,
    errorGetModelVersionsWithTrims: null,
    dataGetPreviousModels: null,
    errorGetPreviousModels: null,
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
        case GET_PREVIOUS_MODELS_INIT:
            return {
                ...state,
                dataGetPreviousModels: null,
                errorGetPreviousModels: null,
            };
        case GET_PREVIOUS_MODELS_OK:
            return {
                ...state,
                dataGetPreviousModels: action.data,
            };
        case GET_PREVIOUS_MODELS_ERROR:
            return {
                ...state,
                errorGetPreviousModels: action.data,
            };
        default:
            return state;
    }
};

export default model;
