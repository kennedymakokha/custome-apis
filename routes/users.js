const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const dotenv = require('dotenv');
const router = express.Router();
const generateToken = require('./Helpers/generateToken')
const User = require('./../models/auth')
dotenv.config();



var jwt = require('jsonwebtoken');
const { registerSchema } = require('../validations/auth');


// router.post('/auth/login', async (req, res, next) => {

//     const user = await User.findOne({ email: req.body.email });

//     if (user) {
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//             res.send({
//                 _id: user._id,
//                 firstname: user.firstname,
//                 surname: user.surname,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 cc: user.cc,
//                 applied: user.applied,
//                 token: generateToken(user),
//             });
//             return;
//         }
//     }
//     res.status(401).send({ message: 'Invalid email or password' });

// })

router.post('/auth/register', async (req, res) => {
    try {

        // Validating User Request Body
        const { error } = await Joi.object(registerSchema).validate(req.body);

        if (error) {

            return res.status(400).json({ success: false, message: error.details[0].message });

        }

        // Checking If Email Address Already Exists
        const email_exists = await User.findOne({ email: req.body.email });

        if (email_exists) {

            return res.status(400).json({ success: false, message: 'Email Address has been taken !' });

        }

        // Checking If Passwords Match
        if (req.body.password_confirmation !== req.body.password) {

            return res.status(400).json({ success: false, message: 'Passwords Do Not Match !' });

        }

        // Creating New User Object With All User Details Before Saving
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password,
            activated: true

        });

        // Hashing User Password
        bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                user.password = hash;
                // Saving User Details In The DB     
                await user.save();
                return res.status(201).json({ success: true, message: "You have successfully registered. !" });

            });

        });

    } catch (error) {

        return res.status(400).json({ success: false, message: "There was error(s) with your submission", error: error });

    }
})

// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find();
//         return res.status(200).json({ success: true, message: "Fetched Successfull", users });
//     } catch (error) {

//         return res.status(400).json({ success: false, message: "There was error(s) with your submission", error: error });

//     }
// })

module.exports = router;