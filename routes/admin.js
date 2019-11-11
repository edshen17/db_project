const express = require('express');
const router = express.Router();
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
} = require('mongoose').Types;

// GET /dashboard
router.get('/dashboard', (req, res) => {
    const title = 'Admin | Dashboard';
    return res.render('supplier', {
      title,
    });
  });

// GET /supplier
router.get('/create-supplier', (req, res) => {
    const title = 'Admin | Supplier';
    return res.render('supplier', {
      title,
    });
  });
  
  // POST /
  // Route to create a new supplier 
  router.post('/create-supplier', (req, res) => {
    const errors = [];
    const {
      supplierName,
      supplierCity,
      supplierState,
      supplierPhone,
    } = req.body;

    Supplier.findOne({
        supplierName,
      })
        .then((supplier) => {
          if (supplier) {
            errors.push({
              msg: 'A supplier with that name already exists',
            });
            res.render('supplier', {
                errors,
                supplierName,
                supplierCity,
                supplierState,
                supplierPhone,
              });
          } else {
            const newSupplier = new Supplier({
                supplierName: req.body.supplierName,
                supplierCity: req.body.supplierCity,
                supplierState: req.body.supplierState,
                supplierPhone: req.body.supplierPhone,
            });
  
            newSupplier.save((err) => {
              if (err) res.redirect('/supplier');
              return res.redirect('/dashboard');
            });
          }
        });
  });


  // GET /admin/item
router.get('/create-item', (req, res) => {
  const title = 'Admin | Item';
  return Supplier.find().lean().then(suppliers => { // get all the suppliers
    return res.render('item', {
      supplierList: suppliers,
      title: title,
    });
  }); 
});

// POST /
// Route to create a new item 
router.post('/create-item', (req, res) => {
  const errors = [];
  const {
    supplierName,
    itemName,
    price,
    itemDescription,
    itemImageURL,
    stock,
  } = req.body;
  Item.findOne({
    supplierName,
    itemName,
  }).then((item) => {
      if (item) {
        errors.push({
          msg: 'An item with that name already exists',
        });
        return Supplier.find().lean().then(suppliers => { // get all the suppliers
          return res.render('item', {
            errors,
            supplierList: suppliers,
            supplier: req.body.supplier,
            itemName: req.body.itemName,
            price: req.body.price,
            itemDescription: itemDescription,
            itemImageURL: req.body.itemImageURL,
            stock: req.body.stock,
          });
        }); 
      } else {
        const newItem = new Item({
            supplier: req.body.supplier,
            itemName: req.body.itemName,
            price: req.body.price,
            itemDescription: itemDescription,
            itemImageURL: req.body.itemImageURL,
            stock: req.body.stock,
        });
        newItem.save((err) => {
          if (err) next(err);
           res.redirect('/dashboard');
        });
      }
    });
});

  module.exports = router;