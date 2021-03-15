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

export const actionCheckOnlineStatus = () => ({
    type: CHECK_ONLINE_STATUS,
});

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
