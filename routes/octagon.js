const express = require('express');
var transporter = require('./helpers/transporter');
const Joi = require('joi');
const { OctagonMailschema } = require('../validations/octagonValidations');
const { mailOptionsHelper } = require('./helpers/mailHelpers');
const { OctagonEmail } = require('../models/emails');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const router = express.Router();
// const generateToken = require('./Helpers/generateToken')
const User = require('./../models/auth');
const { registerSchema, OctagonUserRegSchema, OctagonUserLoginSchema } = require('../validations/auth');
const generateToken = require('./Helpers/generateToken');

router.post('/sent-mail', async (req, res) => {
    let options = await mailOptionsHelper({
        context: {
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
        }, template: "octagon",
        subject: req.body.subject,
        address: "Octagon Dynamics"
    })
    OctagonMailschema.validate(req.body);
    OctagonMailschema.validate({});
    try {
        await OctagonMailschema.validateAsync(req.body);
        const transport = await transporter.sendMail(options);
        const sentEmail = new OctagonEmail(req.body);
        await sentEmail.save();
        return res.status(200).json({ success: true, message: `EMail sent successfull: ${transport.response}` })
    }
    catch (err) {
        return res.status(400).json({ success: false, message: `EMail sending Failled: ${err.details[0].message}` })
    }
})

router.get('/mails', async (req, res) => {
    try {
        const emails = await OctagonEmail.find();
        return res.status(200).json({ success: true, message: `emails fatched succesful`, emails })
    } catch (error) {
        res.status(404).send({ message: 'stocks Not Found' });
    }
})

router.get('/mails/:subject_id', async (req, res) => {
    try {
        const emails = await OctagonEmail.find({ slug: req.params.subject_id });
        return res.status(200).json({ success: true, message: `emails fatched succesful`, emails })
    } catch (error) {
        console.log(error)
        res.status(404).send({ message: 'stocks Not Found' });
    }
})

router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        // Validating User Request Body
        OctagonUserRegSchema.validate(req.body);
        OctagonUserRegSchema.validate({});
        await OctagonUserRegSchema.validateAsync(req.body);

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


        });
        console.log(user)

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
        return res.status(400).json({ success: false, message: "There was error(s) with your submission", error: ` ${error.details[0].message}` });

    }
})

router.post('/login', async (req, res, next) => {
    try {

        /* 	#swagger.tags = ['Octagon Dynamics']
      #swagger.description = 'Endpoint to sign in a  user on octagon Dynamics web application' */

        /*	#swagger.parameters['obj'] = {
                in: 'body',`
                description: 'User information.',
                required: true,
                schema: { $ref: "#/definitions/LoginUser" }
        } */
        OctagonUserLoginSchema.validate(req.body);
        OctagonUserLoginSchema.validate({});
        await OctagonUserLoginSchema.validateAsync(req.body);
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    firstname: user.firstname,
                    surname: user.surname,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    cc: user.cc,
                    applied: user.applied,
                    token: generateToken(user),
                });
                return;
            }
        }
        return res.status(401).send({ message: 'Invalid email or password' });
    } catch (error) {
        console.log(error)
    }


})


module.exports = router;