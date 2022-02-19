const Joi = require('joi');


exports.OctagonMailschema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    message: Joi.string()
        .min(10)
        .max(30)
        .required(),
    subject: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).with('name', 'message').xor('email')

