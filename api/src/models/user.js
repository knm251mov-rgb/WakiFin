const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'Email is not valid',
    },
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters'],
  },

  // ВИДАЛЕНО: Поля isVerified та verifyToken
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  // verifyToken: String,
});

module.exports = mongoose.model('User', userSchema);