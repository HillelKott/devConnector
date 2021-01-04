const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator');
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');


router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('User',
            ['name', 'avatar','profileImageName']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

router.post('/', auth, [
    check('status', 'Status is requierd').not().isEmpty(),
    check('skills', 'Skills is requierd').not().isEmpty()

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { company, website, location, bio,
        status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin
    } = req.body;


    const profileFields = {};
    profileFields.user = req.user.id;
    // if (req.body.handle) profileFields.handle = req.body.handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername)
        profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, { $set: profileFields }, { new: true });

            return res.json(profile);
        };
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar','profileImageName']);
        if (!profiles) res.status(400).json({ msg: 'There is no profile for this user' });
        res.json(profiles);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});


router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id })
            .populate({ path: "user", select: ['name', 'avatar','profileImageName'] });
        if (!profile) res.status(400).json({ msg: 'Profile not found' });
        res.json(profile);

    } catch (err) {
        console.error(err);
        if (err.kind == 'ObjectId') {
            if (!profile) res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server error')
    }
});


router.delete('/', auth, async (req, res) => {
    try {
        await Post.deleteMany({ user: req.user.id });
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});


router.put('/experinece', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { title, company, location, from, to, current, descreption } = req.body;
    const newExp = { title, company, location, from, to, current, descreption };


    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Server error');
    }
});


router.delete('/experinece/:exp_id', auth, async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });

        foundProfile.experience = foundProfile.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id);

        await foundProfile.save();
        return res.status(200).json(foundProfile);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});



router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, descreption } = req.body;
    const newEdu = { school, degree, fieldofstudy, from, to, current, descreption };
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.education.splice(0, 0, newEdu);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error('err.message', err.message);
        res.status(400).send('Server error');
    }
});


router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});


router.get('/github/:username', async (req, res) => {
    let secretClientId, secret;
    if (process.env.githubclientid) {
        secretClientId = process.env.githubclientid;
        secret = process.env.githubsecret
    } else {
        secretClientId = config.get('githubclientid');
        secret = config.get('githubsecret');
    }
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${secretClientId}
            &client_secret=${secret}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }
            res.json(JSON.parse(body));
        });
    } catch (err) {
        res.status(500).send('Server error')
    }
});

module.exports = router;