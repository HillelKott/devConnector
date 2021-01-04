const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');


router.post('/',
    [
        check('name', 'Name is requierd').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Plase enter a pasword with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        };

        const { name, email, password, profileImageName } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }


            // const avatar = gravatar.url(email, {
            //     s: '200',
            //     r: 'pg',
            //     d: 'mm'
            // });

            //             const avatar = normalize(
            //                 gravatar.url(email, {
            //                     s: '200',
            //                     r: 'pg',
            //                     d: 'mm'
            //                 }),
            //                 { forceHttps: true }
            //             );

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'retro'
            });

            user = new User({
                name, email, avatar, password, profileImageName
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        throw err
                    } else {
                        return res.json({ token })
                    }
                }
            )
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }

    });

module.exports = router;