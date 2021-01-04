import axios from 'axios';
import { setAlert } from './alert'
import { CLEAR_PROFILE, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispath => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        dispath({ type: USER_LOADED, payload: res.data });
    } catch (err) {
        dispath({ type: AUTH_ERROR });
    }
};


export const login = (email, password) => async dispath => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/auth', body, config);
        dispath({ type: LOGIN_SUCCESS, payload: res.data });
        dispath(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (err) {
            dispath(setAlert(err.response.statusText, 'danger'))
            errors.forEach(error => dispath(setAlert(error.msg, 'danger')));
        }
        dispath({ type: LOGIN_FAIL });
    };
};

export const register = ({ name, email, password, profileImageName }) => async dispath => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ name, email, password, profileImageName });

    try {
        const res = await axios.post('/api/users', body, config);
        dispath({ type: REGISTER_SUCCESS, payload: res.data });
        dispath(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (err) {
            errors.forEach(error => dispath(setAlert(error.msg, 'danger')));
        }
        dispath({ type: REGISTER_FAIL });
    };
};


export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT })
};