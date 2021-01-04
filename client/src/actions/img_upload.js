import axios from 'axios';
import { PROFILE_ERROR } from './types';



export const fetchProfileImage = () => async dispatch => {
    try {
        const res = await axios.get('/api/img_upload');
        return res.data;
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    };
};



export const addImage = image => async dispatch => {
    try {
        function makeblob(dataURL) {
            const BASE64_MARKER = ';base64,';
            const parts = dataURL.split(BASE64_MARKER);
            const contentType = parts[0].split(':')[1];
            const raw = window.atob(parts[1]);
            const rawLength = raw.length;
            const uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
        
            return new Blob([uInt8Array], { type: contentType });
        }
        let data = new FormData();
        data.append('file',  typeof image === 'string' ? makeblob(image) : image);

        const res = await axios.post('api/img_upload', data);

        if (res) {
            return res.data.file.filename || res.data.file;
        } else {
            return false;
        }
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}
