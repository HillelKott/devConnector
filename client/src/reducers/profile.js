import { GET_REPOS, GET_PROFILES, CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE,ADD_IMAGE } from '../actions/types';

const initalState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
};

export default function (state = initalState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state, profile: payload, loading: false
            };
        case GET_PROFILES:
            return {
                ...state, profiles: payload, loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state, error: payload, loading: false
            };
        case CLEAR_PROFILE:
            return { ...state, profile: null, repos: [], loading: false }
        case GET_REPOS:
            return {
                ...state, repos: payload, loading: false
            }
            case ADD_IMAGE : 
            return {
                ...state, imageData: payload, loading: false
            }
        default:
            return state;
    }
};