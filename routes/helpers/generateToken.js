var jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || 'nabalayo',
        {
            expiresIn: '30d',
        }
    );
};


module.exports = generateToken

