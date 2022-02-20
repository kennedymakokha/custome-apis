const express = require('express');
const { Email } = require('../models/emails');
const { OctagonMailschema } = require('../validations/octagonValidations');
const { mailOptionsHelper } = require('./helpers/mailHelpers');
var transporter = require('./helpers/transporter');
const router = express.Router();

router.post('/sent-mail', async (req, res) => {
    let options = await mailOptionsHelper({
        context: {
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
        },
        template: "email",
        subject: req.body.subject,
        address: "Kennedy Makokha"
    })
    try {
        OctagonMailschema.validate(req.body);
        OctagonMailschema.validate({});
        await OctagonMailschema.validateAsync(req.body);
        const transport = await transporter.sendMail(options);
        const sentEmail = new Email(req.body);
        await sentEmail.save();
        return res.status(200).json({ success: true, message: `Email sent successfull: ${transport.response}` })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: `Email sending Failled:${error.details[0].message}` })
    }
})

router.get('/mails', async (req, res) => {
    try {
        const emails = await Email.find();
        return res.status(200).json({ success: true, message: `emails fatched succesful`, emails })
    } catch (error) {
        res.status(404).send({ message: 'stocks Not Found' });
    }
})

module.exports = router;