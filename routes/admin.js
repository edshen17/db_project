const express = require('express');
const router = express.Router();
const {
  Item,
} = require('../models/Item');
const {
  Supplier,
} = require('../models/Item');
const {
  Category,
} = require('../models/Category');
const {
  ensureAuthenticated,
} = require('../config/auth');
const {
  ObjectId,
} = require('mongoose').Types;

// GET /admin/supplier
// to see the form to create a supplier
router.get('/create-supplier', ensureAuthenticated, (req, res) => {
    const title = 'Admin | Supplier';
    return res.render('create-supplier', {
      title,
    });
  });

// GET /admin/create-category
// to see the form to create a category
router.get('/create-category', ensureAuthenticated, (req, res) => {
  const title = 'Admin | Category';
  return res.render('create-category', {
      title,
  });
});


  // POST /admin/create-category
  // Route to create a new category 
  router.post('/create-category', (req, res) => {
    const errors = [];
    const {
      categoryName,
    } = req.body;

    Category.findOne({
        categoryName,
      })
        .then((category) => {
          if (category) {
            errors.push({
              msg: 'A supplier with that name already exists',
            });
            res.render('create-category', {
                errors,
                categoryName,
              });
          } else {
            const newCategory = new Category({
                categoryName: req.body.categoryName,
            });
  
            newCategory.save((err) => {
              if (err) res.redirect('/admin/create-category');
              return res.redirect('/');
            });
          }
        });
  });

  
  // POST /admin/create-supplier
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
            res.render('create-supplier', {
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
              if (err) res.redirect('/admin/create-supplier');
              return res.redirect('/admin/create-supplier');
            });
          }
        });
  });


// GET /admin/item
router.get('/create-item', ensureAuthenticated, (req, res) => {
  const title = 'Admin | Item';
  return Supplier.find().lean().then(suppliers => { // get all the suppliers
    return Category.find().lean().then(categories => {
      return res.render('create-item', {
        supplierList: suppliers,
        categoryList: categories,
        title: title,
      });
    });
  }); 
});

// POST /create-item
// Route to create a new item 
router.post('/create-item', (req, res) => {
  const errors = [];
  const {
    supplierName,
    categoryName,
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
            categoryList: categories,
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
            category: req.body.category,
        });
        newItem.save((err) => {
          if (err) next(err);
           res.redirect('/admin/create-item');
        });
      }
    });
});

  module.exports = router;