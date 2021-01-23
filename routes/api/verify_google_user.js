const express = require('express');
const router = express.Router();
const config = require('config');
const { OAuth2Client } = require('google-auth-library');
const clientId = config.get('google_client_id');
const client = new OAuth2Client(clientId);

router.get('/', (req, res) => {
    res.send('google varify');
});

router.post('/', async (req, res) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId
    });
    const payload = ticket.getPayload();

    console.log(`User ${payload.name} verified`);

    const { sub, email, name, picture } = payload;
    const userId = sub;
    res.json({ userId, email, fullName: name, photoUrl: picture })
});

module.exports = router;
