const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated,
} = require('../config/auth');

const {
  Item,
} = require('../models/Item');
const {
  ObjectId,
} = require('mongoose').Types;

// Passes user variable from passport session to all pages,
// allowing the navbar to show different links if user is logged in or not
router.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// GET /
// Route for getting all the items
router.get('/', (req, res, next) => {
  Item.find({})
    .sort({
      price: -1,
    })
    .exec((err, items) => {
      if (err) return next(err);
      const title = 'Home';
      return res.render('index', {
        title,
        items,
      });
    });
});


// GET /item/:id
// Route for getting a specific item
router.get('/item/:id', (req, res, next) => {
  Item.find({_id: req.params.id})
    .sort({
      price: -1,
    })
    .exec((err, items) => {
      if (err) return next(err);
      const title = items[0].itemName;
      return res.render('product', {
        title,
        item: items[0],
        quantity: Array.from(Array(items[0].stock).keys()),
      });
    });
});


// GET /dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const title = `${req.user.username} | Shop`;
  const username = req.user.username;
  return res.render('dashboard', {
    title,
    username,
  });
});





module.exports = router;