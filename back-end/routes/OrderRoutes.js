const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
// Route pour créer une nouvelle commande
router.post('/create', OrderController.createOrder);

// Route pour lister les commandes
router.get('/list', OrderController.listOrders);

// Route pour récupérer une commande par ID
router.get('/:id', OrderController.getOrderById);

// Route pour mettre à jour le statut d'une commande
router.put('/:id/status', OrderController.updateOrderStatus);

module.exports = router;
