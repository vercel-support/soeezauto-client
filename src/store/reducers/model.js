import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_MODEL_VERSIONS_WITH_TRIMS_OK,
    GET_MODEL_VERSIONS_WITH_TRIMS_ERROR,
    GET_PREVIOUS_MODELS_INIT,
    GET_PREVIOUS_MODELS_OK,
    GET_PREVIOUS_MODELS_ERROR,
    GET_MODEL_INIT,
    GET_MODEL_OK,
    GET_MODEL_ERROR,
    SET_GET_MODEL_TO_NULL,
} from '../actions';

const initialState = {
    dataGetModelVersionsWithTrims: null,
    errorGetModelVersionsWithTrims: null,
    dataGetPreviousModels: null,
    errorGetPreviousModels: null,
    dataGetModel: null,
    errorGetModel: null,
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
        case GET_MODEL_INIT:
            return {
                ...state,
                dataGetModel: null,
                errorGetModel: null,
                isLoading: true,
            };
        case GET_MODEL_OK:
            return {
                ...state,
                dataGetModel: action.data,
                isLoading: false,
            };
        case GET_MODEL_ERROR:
            return {
                ...state,
                errorGetModel: action.data,
                isLoading: false,
            };
        case SET_GET_MODEL_TO_NULL:
            return {
                ...state,
                dataGetModel: null,
                errorGetModel: null,
            };
        default:
            return state;
    }
};

export default model;
