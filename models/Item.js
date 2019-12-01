'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User');

const SupplierSchema = new Schema({
  supplierName: {
    type: String,
    required: true
  },
  supplierPhone: {
    type: String,
    required: true
  },
  supplierState: {
    type: String,
    required: true
  },
  supplierCity: {
    type: String,
    required: true
  },
});

// Reviews aren't used at all, but perhaps can be something
// we can implement in the future (where items contain reviews, and users can post reviews)
const ReviewSchema = new Schema({
  reviewRating: {
    type: Number,
    required: true,
  },
  reviewContent: {
    type: String,
    required: true,
  },
  reviewer: {
    type: User,
    required: true,
  },
  createdAt: {type: Date, default: Date.now},
  lastEditedAt: {type: Date, default: Date.now},
});

const ItemSchema = new Schema({
  supplier: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  itemImageURL: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    required: true,
  },
  createdAt: {type: Date, default: Date.now, required: false},
  lastEditedAt: {type: Date, default: Date.now, required: false},
  reviews: [ReviewSchema],
  category: {type: String, default: 'Computer Parts', required: true}
});


const Supplier = mongoose.model('supplier', SupplierSchema);
const Item = mongoose.model('item', ItemSchema);
const Review = mongoose.model('review', ReviewSchema);


module.exports.Supplier = Supplier;
module.exports.Item = Item;
module.exports.Review = Review;