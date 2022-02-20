const mongoose = require('mongoose');
const Schema = mongoose.Schema;
URLSlugs = require('mongoose-url-slugs');

const EmailsSchema = new Schema({
    name: { type: String, },
    email: { type: String, },
    subject: { type: String, },
    message: { type: String, },
},
    { timestamps: true }
);
EmailsSchema.plugin(URLSlugs('subject'));
const Email = mongoose.model('portfoliomailstbl', EmailsSchema);



const OctagonEmailSchema = new Schema({
    name: { type: String, },
    email: { type: String, },
    subject: { type: String, },
    message: { type: String, },
},
    { timestamps: true }
);
OctagonEmailSchema.plugin(URLSlugs('subject'));
const OctagonEmail = mongoose.model('octagonmailsTbl', OctagonEmailSchema);
module.exports = { Email, OctagonEmail };