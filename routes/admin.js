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
            // supplier exists
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
// Route to create a new supplier 
router.post('/create-item', (req, res) => {
  const {
    supplierName,
    itemName,
    price,
    itemDescription,
    itemImageURL,
    stock,
  } = req.body;
  console.log(req.body);
});

  module.exports = router;