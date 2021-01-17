export const CHECK_ONLINE_STATUS = 'CHECK_ONLINE_STATUS';
export const CHECK_ONLINE_STATUS_OK = 'CHECK_ONLINE_STATUS_OK';
export const CHECK_ONLINE_STATUS_ERROR = 'CHECK_ONLINE_STATUS_ERROR';

export const POST_CONTACT_EMAIL = 'POST_CONTACT_EMAIL';
export const POST_CONTACT_EMAIL_INIT = 'POST_CONTACT_EMAIL_INIT';
export const POST_CONTACT_EMAIL_OK = 'POST_CONTACT_EMAIL_OK';
export const POST_CONTACT_EMAIL_ERROR = 'POST_CONTACT_EMAIL_ERROR';

export const actionCheckOnlineStatus = () => ({
    type: CHECK_ONLINE_STATUS,
});

export function actionPostContactEmail(values) {
    return {
        type: POST_CONTACT_EMAIL,
        values,
    };
}
