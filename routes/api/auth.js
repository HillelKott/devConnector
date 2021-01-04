const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
});


router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is requierd').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    };

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credantials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credantials' }] });
        };
        const payload = {
            user: {
                id: user.id
            }
        };
        let secret;
        if (process.env.jwtSecret) {
            secret = process.env.jwtSecret
        } else {
            secret = config.get('jwtSecret');
        }

        jwt.sign(payload, secret,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

       
    } catch (err) {
        console.log('err');

        console.error(err.message);
        res.status(500).send('Server error')
    }

});


module.exports = router;