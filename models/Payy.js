const mongoose = require('mongoose')
const { Schema } = mongoose

// Google user schema -----------------------------------------------------
const userSchema4 = new Schema({
    yname: String,
    yemail: String,
    ynumber: Number,
    yanumber: {
        type:Number,
        unique: true
    },
    ycity: String,
    ystate: String,
    ycountry: String
});
const Customer2 = mongoose.model('Payyear', userSchema4);

module.exports = Customer2;