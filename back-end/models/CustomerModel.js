const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        requied: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    creation_date: {
        type: Date,
        default: Date.now(),
    },  

    last_login: {
        type: Date,
        
    },

    valid_account: {
        type: Boolean,
        default: false,
    },  

    active : {
        type: Boolean,
        default: true,
    },
    }
)



const Customer = mongoose.model('Costumer', customerSchema);

module.exports = Customer;