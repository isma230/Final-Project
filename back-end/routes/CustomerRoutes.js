const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const passport = require('passport');
const isAuthenticated = require('../middleware/isAuthenticated');


// Route pour l'inscription d'un nouveau client
router.post('/register',  CustomerController.createCustomerAccount);
 
// Login route
router.post("/login", (req, res, next) => {
    passport.authenticate("customer-local", (err, user, info) => {
        CustomerController.login(req, res, next, user, info); 
    })(req, res, next);
  });

// GET route to list or search all users (with pagination)
router.get('/', isAuthenticated, CustomerController.listOrSearchCustomers);

// GET route to get a user by ID
router.get('/:id', isAuthenticated , CustomerController.getCustomerById);

// PUT route to update a user by ID
router.put('/:id', isAuthenticated , CustomerController.updateCustomerById);

// DELETE route to delete a user by ID
router.delete('/:id', isAuthenticated, CustomerController.deleteCustomerById);

// GET route to get the profile of the currently authenticated user
router.get('/details/profile', isAuthenticated , CustomerController.getCustomerProfile);

// PATCH route to update the profile of the currently authenticated user
router.patch('/details/update', isAuthenticated , CustomerController.updateCustomerProfile);

//validate email
router.get('/validate/:id', CustomerController.validateCustomerAccount);
 



// Logout
router.get('/details/logout', CustomerController.logout);



module.exports = router;
