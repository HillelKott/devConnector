import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import { connect } from 'react-redux';
import { deleteExperienece } from '../../actions/profile';

const Experience = ( { experience, deleteExperienece } ) => {
    const experiences = experience && experience.length ? experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> - {
                    exp.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{exp.from}</Moment>)
                }
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteExperienece(exp._id)}>Delete</button>
            </td>
        </tr>

    )) : null;
    // ! remove the expression
    return (
        <>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </>
    );
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperienece: PropTypes.func.isRequired
};
export default connect(null, { deleteExperienece })(Experience);