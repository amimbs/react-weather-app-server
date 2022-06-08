const express = require('express');
const router = express.Router();
const models = require('../models');
const user = require('../models/user')
const bcyrpt = require('bcrypt');
const saltRounds = 10;

router.post('/', (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    if (!email || !password || !firstName || !lastName || !username) {
        return res.status(400).json({ error: 'All fields are required' });
    };

    bcyrpt.hash(password, saltRounds, (err, hash) => {
        models.User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
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
module.exports = router;