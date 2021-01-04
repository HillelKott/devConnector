import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Profiles from '../profiles/Profiles'
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import AddExperince from '../profile-forms/Addexperinece';
import AddEducation from '../profile-forms/AddEducation';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';

const Routes = () => {
    return (
        <>
            <section className="container">
                <Alert />
                <Switch>
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/profiles' component={Profiles} />
                    <Route exact path='/profile/:id' component={Profile} />
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                    <PrivateRoute exact path='/create-profile' component={CreateProfile} />
                    <PrivateRoute exact path='/edit-profile' component={EditProfile} />
                    <PrivateRoute exact path='/add-experience' component={AddExperince} />
                    <PrivateRoute exact path='/add-education' component={AddEducation} />
                    <PrivateRoute exact path='/posts' component={Posts} />
                    <PrivateRoute exact path='/posts/:id' component={Post} />
                </Switch>
            </section>
        </>
    );
};

export default Routes;
