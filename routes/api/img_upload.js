const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const User = require('../../models/User');
const config = require('config');
let db;
if (process.env.image_mongoURI) {
    db = process.env.image_mongoURI
} else {
    if (process.env.NODE_ENV !== 'production') {
        db = config.get('image_mongoURI')
    } else {
        db = config.get('master_image_mongoURI')
    }
};

const conn = mongoose.createConnection(db, { useNewUrlParser: true });

let gfs;

conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db);
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: db,
    file: (req, file) => {
        return new Promise((res, rej) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return rej(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: 'uploads'
                };
                res(fileInfo);
            });
        });
    }
});


const upload = multer({ storage: storage }).single('file');


router.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                message: "Could not find files"
            });
        }
        return res.json(files);
    });
});

router.get('/files/:filename', (req, res) => {
    gfs.files.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                message: "Could not find file"
            });
        }

        var readstream = gfs.createReadStream({
            filename: files[0].filename
        })
        res.set('Content-Type', files[0].contentType);
        return readstream.pipe(res);
    });
});

router.post('/', upload, async (req, res) => {
    if (req.file || req.body.file) {
        return res.json({
            success: true,
            file: req.file || req.body.file
        });
    };
    res.send({ success: false });
});

module.exports = router;

