import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchProfileImage } from '../actions/img_upload';
import { addImage } from '../actions/img_upload';


const ImgUpload = ({ fetchProfileImage, imageData, addImage }) => {

    const [image, setImage] = useState(null);
    useEffect(() => {
        fetchProfileImage().then(res => setImage(res))
        console.log(image);
        // insert user to func
    }, [fetchProfileImage, setImage]);


    //     const onChange = e => {
    //          e.target.files[0]
    //     };
    // console.log(image);
    //     const onSubmit = e => {
    //         e.preventDefault();
    //         addImage(image);
    //     }

    return (
        <div>

            {image && image.map((file, index) => {
                console.log(file);
                var d = new Date(file.uploadDate);
                return (
                    <div>
                        <tr key={index}>
                            <td><a href={`http://localhost:5000/api/img_upload/files/${file.filename}`}>{file.filename}</a></td>
                            <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>
                            <td>{(Math.round(file.length / 100) / 10) + 'KB'}</td>

                            <img style={{ width: "150px" }} src={`http://localhost:5000/api/img_upload/files/${file.filename}`} />
                        </tr>
                        <img src={file.filename} alt="" style={{ width: "150px" }} />
                    </div>
                )
            })}
            {/* {image && <img style={{ width: "150px" }} src={URL.createObjectURL(image)} alt='imageData' />} */}

            {/* <form className='form' onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="file" name="file" id="file" className="custom-file-input" onChange={onChange} />
                    <label htmlFor="file" className="custom-file-label">Choose File</label>
                    <input type="submit" value="Submit" className="btn btn-primary btn-block" />
                </div>
            </form> */}
        </div>
    );
};


const mapStateToProps = state => ({
    imageData: state.profile.imageData
});

export default connect(mapStateToProps, { fetchProfileImage, addImage })(ImgUpload);

// https://github.com/AndreasLengkeek/mern-gridfs-tutorial/blob/master/client/src/components/App.js