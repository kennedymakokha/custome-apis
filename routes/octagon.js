const express = require('express');

var transporter = require('./helpers/transporter');
const Joi = require('joi');
const { OctagonMailschema } = require('../validations/octagonValidations');
const { mailOptionsHelper } = require('./helpers/mailHelpers');

const router = express.Router();

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
        return res.status(200).json({ success: true, message: `EMail sent successfull: ${transport.response}` })
    }
    catch (err) {
        return res.status(400).json({ success: false, message: `EMail sending Failled: ${err.details[0].message}` })
    }
})
module.exports = router;