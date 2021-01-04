import React from 'react'
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({experience:{description,company,title,lodation,current,to,from, decription}}) => {
    return (
        <div>
           <h3 className='text-dark'>{company}</h3>
           <p> <Moment format='YYYY/MM/DD'>{from}</Moment> - {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}</p> 
    <p><strong>Position: </strong>{title}</p>
    <p>Description: {description}</p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience:PropTypes.array.isRequired
}

export default ProfileExperience
