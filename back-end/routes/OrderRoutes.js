const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const passport = require('passport');
const isAuthenticated = require('../middleware/isAuthenticated');
// Route pour créer une nouvelle commande
router.post('/create',  isAuthenticated, OrderController.createOrder);

// Route pour lister les commandes
router.get('/list', isAuthenticated, OrderController.listOrders);

// Route pour récupérer une commande par ID
router.get('/:id', isAuthenticated, OrderController.getOrderById);

// Route pour mettre à jour le statut d'une commande
router.put('/:id', isAuthenticated, OrderController.updateOrderStatus);

module.exports = router;
