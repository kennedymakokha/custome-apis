const express = require('express');
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
        return res.status(200).json({ success: true, message: `EMail sent successfull: ${transport.response}` })
    } catch (error) {
        return res.status(400).json({ success: false, message: `EMail sending Failled:${error.details[0].message}` })
    }
})
module.exports = router;