const express = require('express');
const router = express.Router();
const SubCategoryController = require('../controllers/SubCategoryController');
const isAuthenticated = require('../middleware/isAuthenticated');


// GET route to list or search all categories (with pagination)
router.post('/', isAuthenticated, SubCategoryController.createSubcategory);

// GET route to list or search all categories (with pagination)
router.get('/', isAuthenticated, SubCategoryController.listOrSearchSubcategories);

// // GET route to get a category by ID
router.get('/:id', isAuthenticated , SubCategoryController.getSubcategoryById);

// // PUT route to update a category by ID
router.put('/:id', isAuthenticated , SubCategoryController.updateSubcategoryById);

// // DELETE route to delete a category by ID
router.delete('/:id', isAuthenticated, SubCategoryController.deleteSubcategoryById);















module.exports = router;