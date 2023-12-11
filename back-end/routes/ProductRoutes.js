const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const isAuthenticated = require('../middleware/isAuthenticated');
const formidable = require('express-formidable');

// POST route to create a new product
router.post('/', isAuthenticated , formidable({
        uploadDir: 'public/uploads', // Set your upload directory
        keepExtensions: true, // Keep file extensions
      }), ProductController.createProduct);

// GET route to list  products
router.get('/', isAuthenticated, ProductController.listProducts);

// GET route to search products
router.get('/search', isAuthenticated , ProductController.searchProducts);

// GET route to search products by ID
router.get('/:id', isAuthenticated , ProductController.getProductById);

// PUT route to update a product by ID 
router.patch('/:id', isAuthenticated , formidable({
    uploadDir: 'public/uploads', // Set your upload directory
    keepExtensions: true, // Keep file extensions
  }), ProductController.updateProduct);

// DELETE route to delete a category by ID
 router.delete('/:id', isAuthenticated, ProductController.deleteProductById);


module.exports = router;