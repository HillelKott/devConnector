import React from 'react'
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { googleSigninSuccess } from '../../actions/social_login';

const socialLogin = ({ googleSigninSuccess }) => {
    require('dotenv').config();

    const onSuccess = async res => {
        console.log('login success');
        googleSigninSuccess(res);
    };

    const onFailure = res => {
        console.log('login fialed' + res);
    };
    return (
        <div>
            welcome to social login
            <div className="Login">
                <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    style={{ marginTop: '100px' }}
                    isSignedIn={true}
                />
            </div>
        </div>
    );
};

export default connect(null, { googleSigninSuccess })(socialLogin);
