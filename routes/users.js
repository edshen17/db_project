const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const {
  Item,
} = require('../models/Item');
const {
  Supplier,
} = require('../models/Item');
const {
  ensureAuthenticated,
} = require('../config/auth');
const {
  ObjectId,
} = require('mongoose').Types.ObjectId;


// Accesses the id param and searches posts by id
router.param('id', (req, res, next, id) => {
  Post.findById(id, (err, post) => {
    if (err) return next(err);
    if (!post) {
      let error = err;
      error = new Error('Not Found');
      error.status = 404;
      return next(error);
    }
    req.post = post;
    return next();
  });
});

// GET /login
router.get('/login', (req, res) => {
  const title = 'Login';
  const error = req.flash('error');

  return res.render('login', {
    title,
    error,
  });
});

// GET users/register
router.get('/register', (req, res) => {
  const title = 'Register';
  return res.render('register', {
    title,
  });
});

// POST /users/register
// Making a user in the db
router.post('/register', (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    password2,
    streetAddress,
    city,
    state,
    zip,
  } = req.body;
  const errors = [];

  // Check if user did not fill out all inputs
  if (!username || !email || !password || !password2 || !firstName || !lastName || !streetAddress || !city || !state || !zip) {
    errors.push({
      msg: 'Please fill out all fields',
    });
  }

  // Check passwords
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match!',
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters long',
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password,
      password2,
    });
  } else {
    // Validation
    User.findOne({
        email,
      })
      .then((user) => {
        if (user) {
          // user exists
          errors.push({
            msg: 'A user with that email already exists',
          });
          res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
          });
        } else {
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            zip: req.body.zip
          });

          newUser.save((err) => {
            if (err) res.redirect('/login');
            passport.authenticate('local')(req, res, () => {
              return res.redirect('/');
            });
          });
        }
      });
  }
});

// POST /users/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// GET /users/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(301).redirect('/users/login');
});



// POST /users/:userId/item/:itemId
// route for users to add an item to their shopping carts
router.post('/:userId/item/:itemId/', ensureAuthenticated, (req, res) => {
  let item = new ObjectId(req.params.itemId);
  User
    .findById(req.params.userId)
    .then(user => {
      for (let i = 0; i < req.body.quantity; i++) {
        user.cart.push(item);
      }
      user.save();
    })
    .catch(err => {
      console.error(err);
    });
});

// POST /users/:userId/item/:itemId/:quantity
// route for users to update a specific item in their shopping carts (quantity)
router.get('/:userId/item/:itemId/:quantity', (req, res) => {
  let item = new ObjectId(req.params.itemId);
  User
    .findById(req.params.userId)
    .then(user => {
      
      let itemArray = user.cart.filter(i => JSON.stringify(i) === JSON.stringify(item));
      if (req.params.quantity > itemArray.length) {
        for (let i = 0; i < req.params.quantity - itemArray.length; i++) { // if the new quantity to be bought > size of current items to be bought
          user.cart.push(item);
        }

      } else if (req.params.quantity < itemArray.length) {
        for (let i = 0; i < itemArray.length - req.params.quantity; i++) { // if the new quantity to be bought > size of current items to be bought
          
        }
      }
      console.log(itemArray);

      // user.save();
    })
    .catch(err => {
      console.error(err);
    });
});



// GET /users/:cart
// Route for getting a specific user's cart
router.get('/:username/cart', ensureAuthenticated, (req, res, next) => {
  let itemCart = [];
  User
    .findById(req.params.username)
    .then(async user => {

      itemIdAndQuantity = {}
      user.cart.forEach(item => { // count the unique items in the cart
        var key = item;
        itemIdAndQuantity[key] = (itemIdAndQuantity[key] || 0) + 1;
      });

      for (let key in itemIdAndQuantity) { // for each key in the itemId/quantity object
        if (itemIdAndQuantity.hasOwnProperty(key)) {
          let item = await Item.findById(key); // get the item data
          let condensedItemData = { // create object with needed information
            itemName: item.itemName,
            itemImageURL: item.itemImageURL,
            price: item.price,
            inStock: item.stock > 0,
            stock: item.stock,
            quantityToBuy: itemIdAndQuantity[key],
          }
          console.log(typeof condensedItemData.quantityToBuy)
          itemCart.push(condensedItemData);
        }
      }

      
      return res.render('cart', {
        title: 'My Cart',
        itemCart,
      });

    })
    .catch(err => {
      console.error(err)
    });


});



module.exports = router;