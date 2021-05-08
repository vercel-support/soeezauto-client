import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_OK,
    GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_ERROR,
    GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_OK,
    GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_ERROR,
    GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_OK,
    GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_ERROR,
    GET_MODELS_WITH_FUEL_FOR_BRAND_OK,
    GET_MODELS_WITH_FUEL_FOR_BRAND_ERROR,
    GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_OK,
    GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_ERROR,
    GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_OK,
    GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_ERROR,
    GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_OK,
    GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_ERROR,
} from '../actions';

const initialState = {
    dataGetModelsWithAutomaticGearboxForBrand: null,
    errorGetModelsWithAutomaticGearboxForBrand: null,
    dataGetModelsWithAirCondAutoForBrand: null,
    errorGetModelsWithAirCondAutoForBrand: null,
    dataGetModelsWithDisplayMultimediaForBrand: null,
    errorGetModelsWithDisplayMultimediaForBrand: null,
    dataGetModelsWithFuelForBrand: null,
    errorGetModelsWithFuelForBrand: null,
    dataGetModelsWithLeatherSeatsForBrand: null,
    errorGetModelsWithLeatherSeatsForBrand: null,
    dataGetModelsWithPowerRangeForBrand: null,
    errorGetModelsWithPowerRangeForBrand: null,
    dataGetModelsWithPriceRangeForBrand: null,
    errorGetModelsWithPriceRangeForBrand: null,
    isLoading: false,
};

const brand = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithAutomaticGearboxForBrand: action.data,
            };
        case GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithAutomaticGearboxForBrand: action.data,
            };
        case GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithAirCondAutoForBrand: action.data,
            };
        case GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithAirCondAutoForBrand: action.data,
            };
        case GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithDisplayMultimediaForBrand: action.data,
            };
        case GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithDisplayMultimediaForBrand: action.data,
            };
        case GET_MODELS_WITH_FUEL_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithFuelForBrand: action.data,
            };
        case GET_MODELS_WITH_FUEL_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithFuelForBrand: action.data,
            };
        case GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithLeatherSeatsForBrand: action.data,
            };
        case GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithLeatherSeatsForBrand: action.data,
            };
        case GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithPowerRangeForBrand: action.data,
            };
        case GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithPowerRangeForBrand: action.data,
            };
        case GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_OK:
            return {
                ...state,
                dataGetModelsWithPriceRangeForBrand: action.data,
            };
        case GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_ERROR:
            return {
                ...state,
                errorGetModelsWithPriceRangeForBrand: action.data,
            };
        default:
            return state;
    }
};

export default brand;
