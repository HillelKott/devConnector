// todo add backend to verify user and then dispatch user_login and user_logout

// import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import axios from 'axios';

export const googleSigninSuccess = res => async () => {
    const body = { token: res.tokenId };
    const headers = { headers: { accept: 'application/json' } };

    await axios.post(`/api/verify_google_user`, body, headers)
        .then(res => console.log(res.data))
};
