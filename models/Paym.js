const mongoose = require('mongoose')
const { Schema } = mongoose

// Google user schema -----------------------------------------------------
const userSchema3 = new Schema({
    pname: String,
    pemail: String,
    pnumber: Number,
    panumber: {
        type:Number,
        unique:true
    },
    pcity: String,
    pstate: String,
    pcountry: String,
});
const Customer1 = mongoose.model('Paymonth', userSchema3);

module.exports = Customer1;