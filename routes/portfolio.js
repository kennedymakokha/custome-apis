const express = require('express');

var transporter = require('./helpers/transporter');


const router = express.Router();

router.post('/sent-mail', async (req, res) => {

    const mailOptions = {
        from: '"kennedymakokha.github.io" <bradcoupers@gmail.com>',
        to: `katchibo2@gmail.com`,
        subject: req.body.subject,
        template: 'email',

        context: {

            name: req.body.name,
            email: req.body.email,
            message: req.body.message,


        }
    };

    try {
        const transport = await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: `EMail sent successfull: ${transport.response}` })

    } catch (error) {
        return res.status(400).json({ success: false, message: `EMail sending Failled: ${error.response}` })
    }


})




module.exports = router;