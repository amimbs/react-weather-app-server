const express = require('express');
const router = express.Router();
const models = require('../models');
const user = require('../models/user')
const bcyrpt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const tokenSecret = process.env.JWT_SECRET;

router.post('/', (req, res) => {
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
            e.errors.forEach(error => {
                errors.push(error.message);
            });
            return res.status(400).json({ error: errors });
        });
    });
});

router.post('/login', async (req, res) => {
    console.log('hello world')
    const { userName, password } = req.body;
    const foundUser = await models.User.findOne({ where: { userName: userName }, raw: true });
    if (!foundUser) {
        return res.status(400).json({ error: 'invalid username' });
    };
    bcyrpt.compare(password, foundUser.password, (err, match) => {
        if (match) {
            const id = foundUser.id;
            const token = jwt.sign({ id }, tokenSecret, {
                expiresIn: 300,
            });
            let responseUser = {
                username: foundUser.username,
                firstName: foundUser.firstName,
                email: foundUser.email,
                id: foundUser.id
            };
            res.status(200).json({ auth: true, token: token, foundUser: responseUser })
        } else {
            res.status(400).json({ error: 'Incorrect Password' })
        };
    });
});

module.exports = router;