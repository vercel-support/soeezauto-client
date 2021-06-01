import axios from 'axios';
import localforage from 'localforage';
import { Now } from 'tools/functions';
import { LANG } from 'parameters';

const trans = {
    fr: {
        accessDenied: "Vous n'etes pas autorise",
        systemError: 'Erreur de systeme. Merci de ressayer ou nous contacter',
    },
    en: {
        accessDenied: 'You do not have access to this',
        systemError: 'System error. Please try again or contact us',
    },
};

export const API_REST = 'API_REST';

export const parseApiErrors = (violations) => {
    return violations.reduce((parsedErrors, violation, index) => {
        const parsedE = parsedErrors;
        const property = violation.propertyPath;
        const message = violation.message;
        parsedE[index] = {
            [property]: message,
        };
        return parsedE;
    }, []);
};

export const apiStd = (urlSuffix, data = null) => {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}${urlSuffix}`;
    return axios.post(url, data).then((response) => {
        return response.data;
    });
};

export const api = (
    method,
    urlSuffix,
    data = null,
    endpoint = API_REST,
    auth = true, // require bearer token
) => {
    // update last active on indexeddb
    if (endpoint !== 'favicon') {
        localforage.setItem('lastActiveAt', Now());
    }
    let url = `${process.env.NEXT_PUBLIC_API_REST_URL}${urlSuffix}`;
    if (endpoint !== API_REST) {
        url = urlSuffix;
    }
    if (!auth) {
        return axios({
            method,
            url,
            data,
            headers: {},
        }).then((response) => {
            return response.data;
        });
    }
    return axios({
        method,
        url,
        data,
    }).then((response) => {
        return response.data;
    });
};

export const apiQl = (data, variables = null, isForage = null) => {
    // update last active on indexeddb
    if (isForage) {
        localforage.setItem('lastActiveAt', Now());
    }
    return axios
        .post(process.env.NEXT_PUBLIC_API_GRAPHQL_URL, {
            query: data,
            variables,
        })
        .then((response) => {
            return response.data;
        });
};

export const apiWp = (data, variables = null, isForage = null) => {
    // update last active on indexeddb
    if (isForage) {
        localforage.setItem('lastActiveAt', Now());
    }
    return axios
        .post(process.env.NEXT_PUBLIC_WP_API_URL, {
            query: data,
            variables,
        })
        .then((response) => {
            return response.data;
        });
};

export function errorParser(error) {
    const title = 'error';
    const description = error['hydra:description'];
    const parsedE = [];
    const obj = {};
    obj[title] = description;
    parsedE.push(obj);
    return parsedE;
}

export function errorParserGraphql(errors) {
    if (errors[0].message === 'Access Denied.') {
        return [{ message: trans[LANG].accessDenied }];
    }
    const parsedE = [];
    errors.forEach((error) => {
        // graphql variable error
        if (error.message.startsWith('Variable ')) {
            const origKey = error.message.match(/\$[a-zA-z0-9]+/gm);
            let key = origKey[0].replace('$', '');
            const position = key.search(/[A-Z]/);
            if (position !== -1) {
                key = key.toLowerCase();
                key = `${key.slice(0, position)} ${key.slice(position)}`;
            }
            const obj = {};
            obj[key] = error.message.replace(`Variable "${origKey}"`, '');
            parsedE.push(obj);
        } else {
            // symfony validation error
            const split = error.message.split(':');
            if (split.length > 1) {
                const key = split[0].trim();
                const obj = {};
                obj[key] = split[1].trim();
                parsedE.push(obj);
            } else {
                const key = 'message';
                const obj = {};
                obj[key] = split[0].trim();
                parsedE.push(obj);
            }
        }
    });
    return parsedE;
}

export function violationParser(error) {
    const statusCode = error.status;
    let data = [];
    if (statusCode === 401) {
        data[0] = error.data;
    } else if (statusCode === 400) {
        const violations = error.data.violations;
        data = parseApiErrors(violations);
    } else if (statusCode === 403) {
        data = errorParser(error.data);
    } else if (statusCode === 500) {
        data.push({
            error: trans[LANG].systemError,
        });
    }
    return data;
}

export const hydraPageCount = (collection) => {
    if (!collection['hydra:view']) {
        return 1;
    }

    return Number(collection['hydra:view']['hydra:last'].match(/page=(\d+)/)[1]);
};

const canWriteBlogPostRoles = ['ROLE_WRITER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'];

export const canWriteBlogPost = (userData) => {
    return (
        userData !== null &&
        userData.roles.some((userRoles) => canWriteBlogPostRoles.includes(userRoles))
    );
};
