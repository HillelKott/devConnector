import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';


function Login({ login, isAuthenticated }) {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        login(email, password)
    };

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead">
                <i className="fas fa-user" /> Sign Into Your Account
              </p>
            <form className='form' onSubmit={onSubmit}>
                <div className="form-group">
                    <input type='email'
                        placeholder='Email Address'
                        name='email'
                        autoComplete='username'
                        onChange={onChange}
                        value={email}
                    />
                </div>
                <div className='form-group'>
                    <input type='password'
                        placeholder='Password'
                        name='password'
                        minLength='6'
                        autoComplete='current-password'
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Dont have an account? <Link to="/register">Sign Up</Link>
            </p>
        </>
    )
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
