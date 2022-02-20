const Joi = require('joi');
exports.OctagonUserRegSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    phone_number: Joi.number()

        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    password_confirmation: Joi.ref('password'),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).with('name', 'phone_number').xor('email')


exports.OctagonUserLoginSchema = Joi.object({
    password: Joi.string()
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
}).with('name', 'phone_number').xor('email')
