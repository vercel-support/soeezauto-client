import { HYDRATE } from 'next-redux-wrapper';
import {
    GET_POSTS_NEXT_INIT,
    GET_POSTS_NEXT_OK,
    GET_POSTS_NEXT_ERROR,
    GET_POSTS_PREVIOUS_INIT,
    GET_POSTS_PREVIOUS_OK,
    GET_POSTS_PREVIOUS_ERROR,
} from '../actions';

const initialState = {
    dataGetPostsNext: null,
    errorGetPostsNext: null,
    dataGetPostsPrevious: null,
    errorGetPostsPrevious: null,
    isLoading: false,
};

const post = (state = initialState, action) => {
    switch (action.type) {
        case HYDRATE: {
            return {
                ...state,
                ...action.data,
            };
        }
        case GET_POSTS_NEXT_INIT:
            return {
                ...state,
                dataGetPostsNext: null,
                errorGetPostsNext: null,
                isLoading: true,
            };
        case GET_POSTS_NEXT_OK: {
            return {
                ...state,
                dataGetPostsNext: action.data,
                isLoading: false,
            };
        }
        case GET_POSTS_NEXT_ERROR:
            return {
                ...state,
                errorGetPostsNext: action.data,
                isLoading: false,
            };
        case GET_POSTS_PREVIOUS_INIT:
            return {
                ...state,
                dataGetPostsPrevious: null,
                errorGetPostsPrevious: null,
                isLoading: true,
            };
        case GET_POSTS_PREVIOUS_OK:
            return {
                ...state,
                dataGetPostsPrevious: action.data,
                isLoading: false,
            };
        case GET_POSTS_PREVIOUS_ERROR:
            return {
                ...state,
                errorGetPostsPrevious: action.data,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default post;
