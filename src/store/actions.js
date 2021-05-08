export const CHECK_ONLINE_STATUS = 'CHECK_ONLINE_STATUS';
export const CHECK_ONLINE_STATUS_OK = 'CHECK_ONLINE_STATUS_OK';
export const CHECK_ONLINE_STATUS_ERROR = 'CHECK_ONLINE_STATUS_ERROR';

export const LOGOUT_INIT = 'LOGOUT_INIT';
export const LOGOUT_TOKEN_EXPIRED = 'LOGOUT_TOKEN_EXPIRED';
export const LOGOUT = 'LOGOUT';

export const POST_CONTACT_EMAIL = 'POST_CONTACT_EMAIL';
export const POST_CONTACT_EMAIL_INIT = 'POST_CONTACT_EMAIL_INIT';
export const POST_CONTACT_EMAIL_OK = 'POST_CONTACT_EMAIL_OK';
export const POST_CONTACT_EMAIL_ERROR = 'POST_CONTACT_EMAIL_ERROR';

export const GET_MODEL_VERSIONS_WITH_TRIMS = 'GET_MODEL_VERSIONS_WITH_TRIMS';
export const GET_MODEL_VERSIONS_WITH_TRIMS_OK = 'GET_MODEL_VERSIONS_WITH_TRIMS_OK';
export const GET_MODEL_VERSIONS_WITH_TRIMS_ERROR = 'GET_MODEL_VERSIONS_WITH_TRIMS_ERROR';

export const GET_PREVIOUS_MODELS = 'GET_PREVIOUS_MODELS';
export const GET_PREVIOUS_MODELS_INIT = 'GET_PREVIOUS_MODELS_INIT';
export const GET_PREVIOUS_MODELS_OK = 'GET_PREVIOUS_MODELS_OK';
export const GET_PREVIOUS_MODELS_ERROR = 'GET_PREVIOUS_MODELS_ERROR';

export const GET_MODEL = 'GET_MODEL';
export const GET_MODEL_INIT = 'GET_MODEL_INIT';
export const GET_MODEL_OK = 'GET_MODEL_OK';
export const GET_MODEL_ERROR = 'GET_MODEL_ERROR';

export const GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND =
    'GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND';
export const GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_OK =
    'GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_OK';
export const GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND_ERROR';

export const GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND =
    'GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND';
export const GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_OK =
    'GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_OK';
export const GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND_ERROR';

export const GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND =
    'GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND';
export const GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_OK =
    'GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_OK';
export const GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND_ERROR';
export const actionCheckOnlineStatus = () => ({
    type: CHECK_ONLINE_STATUS,
});

export const GET_MODELS_WITH_FUEL_FOR_BRAND = 'GET_MODELS_WITH_FUEL_FOR_BRAND';
export const GET_MODELS_WITH_FUEL_FOR_BRAND_OK = 'GET_MODELS_WITH_FUEL_FOR_BRAND_OK';
export const GET_MODELS_WITH_FUEL_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_FUEL_FOR_BRAND_ERROR';

export const GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND =
    'GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND';
export const GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_OK =
    'GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_OK';
export const GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND_ERROR';

export const GET_MODELS_WITH_POWER_RANGE_FOR_BRAND =
    'GET_MODELS_WITH_POWER_RANGE_FOR_BRAND';
export const GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_OK =
    'GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_OK';
export const GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_POWER_RANGE_FOR_BRAND_ERROR';

export const GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND =
    'GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND';
export const GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_OK =
    'GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_OK';
export const GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_ERROR =
    'GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND_ERROR';

export const POST_CLIENT_LOG = 'POST_CLIENT_LOG';
export const POST_CLIENT_LOG_INIT = 'POST_CLIENT_LOG_INIT';
export const POST_CLIENT_LOG_OK = 'POST_CLIENT_LOG_OK';
export const POST_CLIENT_LOG_ERROR = 'POST_CLIENT_LOG_ERROR';

export const actionLogoutInit = () => ({
    type: LOGOUT_INIT,
});

export const actionLogoutTokenExpired = () => ({
    type: LOGOUT_TOKEN_EXPIRED,
});

export const actionLogout = () => ({
    type: LOGOUT,
});

export function actionPostContactEmail(values) {
    return {
        type: POST_CONTACT_EMAIL,
        values,
    };
}

export function actionGetModelVersionsWithTrims(values) {
    return {
        type: GET_MODEL_VERSIONS_WITH_TRIMS,
        values,
    };
}

export function actionGetPreviousModels(values) {
    return {
        type: GET_PREVIOUS_MODELS,
        values,
    };
}

export function actionGetModel(modelId) {
    return {
        type: GET_MODEL,
        modelId,
    };
}

export function actionGetModelsWithAutomaticGearboxForBrand(values) {
    return {
        type: GET_MODELS_WITH_AUTOMATIC_GEARBOX_FOR_BRAND,
        values,
    };
}

export function actionGetModelsWithAirCondAutoForBrand(values) {
    return {
        type: GET_MODELS_WITH_AIR_COND_AUTO_FOR_BRAND,
        values,
    };
}

export function actionGetModelsWithDisplayMultimediaForBrand(values) {
    return {
        type: GET_MODELS_WITH_DISPLAY_MULTIMEDIA_FOR_BRAND,
        values,
    };
}

export function actionGetModelsWithFuelForBrand(values) {
    return {
        type: GET_MODELS_WITH_FUEL_FOR_BRAND,
        values,
    };
}

export function actionGetModelsWithLeatherSeatsForBrand(values) {
    return {
        type: GET_MODELS_WITH_LEATHER_SEATS_FOR_BRAND,
        values,
    };
}

export function actionGetModelsWithPowerRangeForBrand(values) {
    return {
        type: GET_MODELS_WITH_POWER_RANGE_FOR_BRAND,
        values,
    };
}

export function actionGetModelsWithPriceRangeForBrand(values) {
    return {
        type: GET_MODELS_WITH_PRICE_RANGE_FOR_BRAND,
        values,
    };
}

export function actionPostClientLog(values) {
    return {
        type: POST_CLIENT_LOG,
        values,
    };
}
