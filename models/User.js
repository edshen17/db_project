'use strict';
const mongoose = require('mongoose');
const Item = require('../models/Item').schema;
const Review = require('../models/Item').schema;
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  cart: {
    type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    default: [],
    required: false,
  },
  purchaseHistory: {
    type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    default: [],
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  reviews: {
    type: [Review],
    default: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    required: false,
  },
});

// before saving into db, hash password
UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
