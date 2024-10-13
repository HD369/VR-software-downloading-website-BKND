const mongoose = require('mongoose')
const { Schema } = mongoose

// Google user schema -----------------------------------------------------
const userSchema2 = new Schema({
    userName: String,
    name: String,
    email: String,
    password: String,
});
const googleuser = mongoose.model('GoogleUser', userSchema2);

module.exports = googleuser;