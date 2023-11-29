const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const isAuthenticated = require('../middleware/isAuthenticated');


// GET route to list or search all categories (with pagination)
router.post('/create', isAuthenticated, CategoryController.createCategory);

// GET route to list or search all categories (with pagination)
router.get('/', isAuthenticated, CategoryController.listOrSearchCategories);

// GET route to get a category by ID
router.get('/:id', isAuthenticated , CategoryController.getCategoryById);

// PUT route to update a category by ID
router.put('/:id', isAuthenticated , CategoryController.updateCategoryById);

// DELETE route to delete a category by ID
router.delete('/:id', isAuthenticated, CategoryController.deleteCategoryById);















module.exports = router;