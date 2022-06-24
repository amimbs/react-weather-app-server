const express = require('express');
const router = express.Router();
const models = require('../models');
const user = require('../models/user')
const bcyrpt = require('bcrypt');
const saltRounds = 10;


router.post('/register', (req, res) => {
    const { firstName, lastName, email, userName, password } = req.body;
    if (!email || !password || !firstName || !lastName || !userName) {
        return res.status(400).json({ error: 'All fields are required' });
    };

    bcyrpt.hash(password, saltRounds, (err, hash) => {
        models.User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            userName: userName,
            password: hash
        }).then((user) => {
            return res.status(200).json({ success: true, user_id: user.id });
        }).catch(e => {
            let errors = [];
            if (e.errors) {
                e.errors.forEach(error => {
                    errors.push(error.message);
                });
            };
            return res.status(400).json({ error: errors });
        });
    });
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    const foundUser = await models.User.findOne({ where: { userName: userName }, raw: true });
    if (!foundUser) {
        return res.status(400).json({ error: 'invalid username' });
    };
    bcyrpt.compare(password, foundUser.password, (err, match) => {
        if (match) {
            const id = foundUser.id;
            let responseUser = {
                username: foundUser.username,
                firstName: foundUser.firstName,
                email: foundUser.email,
                id: foundUser.id,
                defaultCity: foundUser.defaultCity
            };
            res.status(200).json({ foundUser: responseUser });
        } else {
            res.status(400).json({ error: 'Incorrect Password' });
        };
    });
});

router.post('/set-default', async (req, res) => {
    console.log(req.body)
    const { defaultCity, userId } = req.body;
    await models.User.update({ defaultCity: defaultCity }, {
        where: {
            id: userId
        }
    });
    res.status(200).json({ succes: true });
});

module.exports = router;