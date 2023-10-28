const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-validator');
const bcrypt = require('bcrypt');

const emailValidator = mongooseValidator({
  validator: 'isEmail',
  message: 'Invalid email address',
});

const userSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
    validate: emailValidator,
  },
  role: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
    default: null,
  },
  last_update: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
