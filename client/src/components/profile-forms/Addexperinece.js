import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { addExperinece } from '../../actions/profile';

const AddExperience = ({ addExperinece, history }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    const {
        title,
        company,
        location,
        from,
        to,
        description,
        current
    } = formData;

    const [toDataDisabled, toggleDisabled] = useState(false);

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    // 050
    // got a bug...
    return (
        <>
            <h1 className="large text-primary">Add An Experience</h1>
            <p className="lead">
                <i className="fas fa-code-branch" /> Add any developer/programming
        positions that you have had in the past
      </p>
            <small>* = required field</small>
            <form
                className="form"
                onSubmit={e => {
                    e.preventDefault();
                    addExperinece(formData, history);
                }}
            >
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Job Title"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Company"
                        name="company"
                        value={company}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={location}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from" value={from} onChange={onChange} />
                </div>
                <div className="form-group">
                    <p>
                        <input
                            type="checkbox"
                            name="current"
                            checked={current}
                            value={current}
                            onChange={e => {
                                setFormData({ ...formData, current: !current });
                                toggleDisabled(!toDataDisabled)
                            }
                            }
                        />{' '}
            Current Job
          </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input
                        type="date"
                        name="to"
                        value={to}
                        onChange={onChange}
                        disabled={toDataDisabled ? 'disabled' : ''}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Job Description"
                        value={description}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">
                    Go Back
        </Link>
            </form>
        </>
    );
};


AddExperience.propTypes = {
    addExperinece: PropTypes.func.isRequired
}

export default connect(null, { addExperinece })(withRouter(AddExperience));
