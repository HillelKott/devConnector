import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { addImage } from '../../actions/img_upload';
import ProfilePictore from '../ProfilePictore';


function Register({ setAlert, register, isAuthenticated, addImage }) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        profileImageName: ' '
    });
    const [addPicture, setAddPicture] = useState(false);
    const { name, email, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const setProfileImage = e => setFormData({ ...formData, 'profileImageName': (addPicture ? e : e.target.files[0]) });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Password do not mach', 'danger');
        } else {
            if (formData.profileImageName !== ' ') {
                const profileImageName = await addImage(formData.profileImageName);
                if (profileImageName) {
                    register({ name, email, password, profileImageName });
                }
            }
            else {
                register({ name, email, password });
            }
        }
    };

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    };

    return (
        <>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
                <i className="fas fa-user" /> Create Your Account
              </p>
            <form className='form' onSubmit={onSubmit}>
                <div className='form-group'>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />                </div>
                <div className="form-group">
                    <input type='email'
                        placeholder='Email Address'
                        autoComplete='username'
                        name='email'
                        onChange={onChange}
                        value={email}
                        required
                    />
                    <small className='form-text'>
                        This site uses Gravatar so if you want a profile image, use a
                        Gravatar email
                    </small>
                </div>
                <div className='form-group'>
                    <input type='password'
                        placeholder='Password'
                        name='password'
                        autoComplete='new-password'
                        minLength='6'
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <input type='password'
                        placeholder='Confirm Password'
                        name='password2'
                        autoComplete='new-password2'
                        minLength='6'
                        value={password2}
                        onChange={onChange}
                    />
                </div>
                <label className="profile-img-cont">

                    {formData.profileImageName === ' ' ?
                        <div className='form-group'>
                            <label htmlFor="file" className="file-label">Upload Profile Image
                                    <input type="file"
                                    name="profileImage"
                                    id="file"
                                    onChange={setProfileImage}
                                />
                            </label>
                        </div>
                        :
                        <img className="profile-img"
                            style={{ width: "150px" }}
                            src={addPicture ? formData.profileImageName : URL.createObjectURL(formData.profileImageName)}
                            alt='imageData'
                        />
                    }
                </label>
                <div className='picture-btn btn btn-primary' style={{ display: addPicture ? 'none' : 'block' }}
                    onClick={() => setAddPicture(!addPicture)}
                >
                    Take A Picture
                </div>
                <br></br>
                {addPicture ? <ProfilePictore setProfileImage={setProfileImage}/> : null}
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </>
    )
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register, addImage })(Register);
