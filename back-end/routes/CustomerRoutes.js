const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const passport = require('passport');

// Route pour l'inscription d'un nouveau client
router.post('/register',  CustomerController.registerCustomer);
 
// Route pour l'authentification d'un client
router.post('/login',passport.authenticate('customer-local'), CustomerController.loginCustomer);

// Route pour obtenir le profil du client actuellement authentifié
router.get('/profile', CustomerController.getCustomerProfile);

// Route pour mettre à jour le profil du client actuellement authentifié
router.put('/profile', CustomerController.updateCustomerProfile);

// Modifiez le nom de la route pour correspondre à la fonction du contrôleur
router.delete('/profile', CustomerController.deleteCustomerAccount);

// Récupérer la liste de tous les clients
router.get('/customers?page=1&sort=DESC', CustomerController.getAllCustomers);

// Ajoutez la route GET pour la recherche de clients
router.get('/v1/customers', CustomerController.searchForCustomer);

// Définissez la route pour obtenir un client par ID
router.get('/customers/:id', CustomerController.getCustomerById);

// Envoyer l'email de validation
router.post('/send-validation-email', passport.authenticate('jwt', { session: false }), CustomerController.sendValidationEmail);

// Valider l'email
router.get('/validate-email', CustomerController.validateEmail);

// Route pour mettre à jour les données d'un client par ID
router.put('/v1/customers/:id', CustomerController.updateCustomerData);


module.exports = router;
