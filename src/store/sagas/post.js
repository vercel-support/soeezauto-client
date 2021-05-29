import { all, call, put, takeLatest } from 'redux-saga/effects';
import localforage from 'localforage';
import {
    CLIENT_LOG,
    LOGOUT_TOKEN_EXPIRED,
    CHECK_ONLINE_STATUS_ERROR,
    GET_POSTS_NEXT,
    GET_POSTS_NEXT_INIT,
    GET_POSTS_NEXT_OK,
    GET_POSTS_NEXT_ERROR,
    GET_POSTS_PREVIOUS,
    GET_POSTS_PREVIOUS_INIT,
    GET_POSTS_PREVIOUS_OK,
    GET_POSTS_PREVIOUS_ERROR,
} from 'store/actions';
import { apiWp, errorParserGraphql } from 'lib/functions';

function* getPostsNext(action) {
    const queryQl = `query getPostsNext($after: String!) {
        posts(
            where: {
                orderby:{field: DATE, order: DESC},
                categoryNotIn: "167"
            },
            after: $after,
            first: 10
        ) {
            pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
                total
            }
            edges {
                node {
                    title
                    excerpt
                    uri
                    slug
                    date
                    categories {
                        nodes {
                            name
                        }
                    }
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }`;
    const variables = {
        after: action.values.cursor,
    };
    try {
        yield put({
            type: GET_POSTS_NEXT_INIT,
        });

        const data = yield call(apiWp, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_POSTS_NEXT_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_POSTS_NEXT,
                },
            });
        } else {
            yield put({
                type: GET_POSTS_NEXT_OK,
                data: data.data.posts,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

function* getPostsPrevious(action) {
    const queryQl = `query getPostsPrevious($before: String!) {
        posts(
            where: {
                orderby:{field: DATE, order: DESC},
                categoryNotIn: "167"
            },
            before: $before,
            last: 10
        ) {
            pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
                total
            }
            edges {
                node {
                    title
                    excerpt
                    uri
                    slug
                    date
                    categories {
                        nodes {
                            name
                        }
                    }
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }`;
    const variables = {
        before: action.values.cursor,
    };
    try {
        yield put({
            type: GET_POSTS_PREVIOUS_INIT,
        });

        const data = yield call(apiWp, queryQl, variables);
        if (data.errors) {
            yield put({
                type: GET_POSTS_PREVIOUS_ERROR,
                data: errorParserGraphql(data.errors),
            });
            yield put({
                type: CLIENT_LOG,
                data: {
                    message: errorParserGraphql(data.errors),
                    action: GET_POSTS_PREVIOUS,
                },
            });
        } else {
            yield put({
                type: GET_POSTS_PREVIOUS_OK,
                data: data.data.posts,
            });
        }
    } catch (error) {
        const isOffline = !!(
            error.response === undefined || error.code === 'ECONNABORTED'
        );
        if (error.response.status === 401) {
            yield put({
                type: LOGOUT_TOKEN_EXPIRED,
            });
        } else if (isOffline) {
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((value) => {
                if (value === null) {
                    localforage.setItem('offline-event-fired', true);
                }
            });
            yield put({
                type: CHECK_ONLINE_STATUS_ERROR,
                isOnline: false,
            });
        }
    }
}

// eslint-disable-next-line func-names
export default function* contactEmail() {
    yield all([
        takeLatest(GET_POSTS_NEXT, getPostsNext),
        takeLatest(GET_POSTS_PREVIOUS, getPostsPrevious),
    ]);
}
