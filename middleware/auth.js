const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    };
    let secretToken;
    if (process.env.jwtSecret) {
        secretToken = process.env.jwtSecret
    } else {
        secretToken = config.get('jwtSecret');
    }
    try {
        const decoded = jwt.verify(token, secretToken);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' })
    };
};