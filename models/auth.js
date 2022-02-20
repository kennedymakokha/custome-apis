const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    phone_number: {
        type: String,
    },

    password: {
        type: String,
        required: true,
        min: 6
    },
    updated_at: {
        type: Date,
        default: Date.now
    },

    deleted_at: {
        type: Date,
        default: null
    }

},
{
    timestamps:true
});



module.exports = mongoose.model('users', UserSchema);