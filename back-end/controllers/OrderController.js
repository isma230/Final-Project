const Order = require('../models/OrderModel');
const { v4: uuidv4 } = require('uuid');
const Customer = require('../models/CustomerModel');
const passport = require('passport');

const createOrder = async (req, res) => {
  try {
    // 1. Vérifier si l'utilisateur est authentifié
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à effectuer cette action. Vous devez être authentifié." });
    }

    // 2. Vérifier si l'utilisateur a validé son e-mail
    if (!req.user.valid_account) {
      return res.status(403).json({ message: "Vous devez d'abord valider votre adresse e-mail pour créer une commande." });
    }

    // 3. Vérifier si l'utilisateur est un client
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: "Seuls les clients peuvent créer une commande." });
    }

    const { customerID, orderItems, cartTotalPrice } = req.body;

    // 4. Créer une nouvelle commande avec le statut "Open" par défaut
    const newOrder = new Order({
      id: generateOrderId(),
      customer_id: customerID,
      order_items: orderItems,
      cart_total_price: cartTotalPrice,
    });

    // 5. Mettre à jour la date de la commande
    newOrder.order_date = new Date();

    await newOrder.save();

    res.status(201).json({ message: "Commande créée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la création de la commande." });
  }
};


function isAuthorizedUser(req, allowedRoles) {
    if (!req.user) {
      return false;
    }
  
    return allowedRoles.includes(req.user.role);
  }

// Fonction pour générer un ID de commande unique en utilisant uuid
function generateOrderId() {
  return uuidv4();
}

const listOrders = async (req, res) => {
  try {
    // 1. Vérifier si l'utilisateur a les rôles d'administrateur ou de gestionnaire
    if (!isAuthorizedUser(req, ['admin', 'manager'])) {
      return res.status(403).json({ message: "Vous n'avez pas les privilèges nécessaires pour accéder à cette ressource." });
    }

    // 2. Récupérer la page demandée depuis les paramètres de requête (par exemple, ?page=1)
    const page = parseInt(req.query.page) || 1;

    // 3. Limite par page (dans cet exemple, 10 commandes par page)
    const limit = 10;

    // 4. Récupérer la liste de commandes avec des détails de client
    const orders = await Order.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // 5. Créer un tableau pour stocker les données finales
    const ordersWithCustomerInfo = [];

    for (const order of orders) {
      const customer = await Customer.findOne({ _id: order.customer_id });

      if (customer) {
        // 6. Construire l'objet de commande avec des détails de client
        const orderData = {
          _id: order._id,
          customerID: order.customer_id,
          customerFirstName: customer.first_name,
          customerLastName: customer.last_name,
          itemsTotal: order.order_items.length,
          orderDate: order.order_date,
          cartTotalPrice: order.cart_total_price,
          status: order.status,
        };

        ordersWithCustomerInfo.push(orderData);
      }
    }

    res.status(200).json({ data: ordersWithCustomerInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération de la liste des commandes." });
  }
};

const getOrderById = async (req, res) => {
  try {
    // 1. Vérifier si l'utilisateur a les rôles d'administrateur ou de gestionnaire
    if (!isAuthorizedUser(req, ['admin', 'manager'])) {
      return res.status(403).json({ message: "Vous n'avez pas les privilèges nécessaires pour accéder à cette ressource." });
    }

    // 2. Récupérer l'ID de commande depuis les paramètres de requête (par exemple, /orders/123)
    const orderId = req.params.id;

    // 3. Rechercher la commande par son ID
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    // 4. Récupérer le client associé à la commande
    const customer = await Customer.findOne({ _id: order.customer_id });

    if (!customer) {
      return res.status(404).json({ message: "Client non trouvé pour cette commande." });
    }

    // 5. Construire l'objet de commande avec les détails du client
    const orderData = {
      _id: order._id,
      customerID: order.customer_id,
      customerFirstName: customer.first_name,
      customerLastName: customer.last_name,
      orderItems: order.order_items,
      orderDate: order.order_date,
      cartTotalPrice: order.cart_total_price,
      status: order.status,
    };

    res.status(200).json({ data: [orderData] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des détails de la commande." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    // 1. Vérifier si l'utilisateur a les rôles d'administrateur ou de gestionnaire
    if (!isAuthorizedUser(req, ['admin', 'manager'])) {
      return res.status(403).json({ message: "Vous n'avez pas les privilèges nécessaires pour effectuer cette action." });
    }

    // 2. Récupérer l'ID de commande depuis les paramètres de requête (par exemple, /orders/123)
    const orderId = req.params.id;

    // 3. Récupérer le nouveau statut de commande depuis le corps de la requête
    const { status } = req.body;

    // 4. Rechercher la commande par son ID
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "ID de commande invalide." });
    }

    // 5. Mettre à jour le statut de la commande
    order.status = status;
    await order.save();

    res.status(200).json({ message: "Statut de commande mis à jour avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du statut de commande." });
  }
};

module.exports = { createOrder, listOrders, getOrderById, updateOrderStatus };
