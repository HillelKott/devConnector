const mongoose = require('mongoose');
const config = require('config');

let db;
if (config.get('mongoURI')) {
    db = config.get('mongoURI');
} else {
    db = process.env.mongoURI;
};

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('mongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;