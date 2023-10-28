const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const passport = require('passport');
const isAuthenticated = require('../middleware/isAuthenticated');

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local-login", (err, user, info) => {
    userController.login(req, res, next, user, info); 
  })(req, res, next);
});

// Create User (accessible only to Admin users)
router.post('/create-user', isAuthenticated, userController.createUser);

// GET route to list or search all users (with pagination)
router.get('/', isAuthenticated, userController.listOrSearchUsers);

// GET route to get a user by ID
router.get('/details/:id', isAuthenticated, userController.getUserById);

// PUT route to update a user by ID
router.put('/:id', isAuthenticated, userController.updateUserById);

// DELETE route to delete a user by ID
router.delete('/:id', isAuthenticated, userController.deleteUserById);

// Logout
router.get('/logout', userController.logout);
 


module.exports = router;
