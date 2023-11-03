const Order = require('../models/OrderModel');
const { v4: uuidv4 } = require('uuid');
const Customer = require('../models/CustomerModel');

exports.createOrder = async (req, res) => {
  try {
    // Récupérer les informations nécessaires depuis la requête
    const { customerID, orderItems, cartTotalPrice } = req.body;

    // Créer une nouvelle commande avec le statut "Open" par défaut
    const orderId = uuidv4(); // Générez un nouvel ID pour la commande
    const newOrder = new Order({
      _id: orderId,
      customer_id: customerID,
      order_items: orderItems,
      cart_total_price: cartTotalPrice,
      status: "Open", // Statut par défaut
      order_date: new Date(), // Date de la commande
    });

    // Enregistrer la nouvelle commande dans la base de données
    await newOrder.save();

    res.status(201).json({ message: "Commande créée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la création de la commande" });
  }
}

exports.listOrders = async (req, res) => {
  try {
    // Vérifier les privilèges de l'utilisateur
    if (!["Admin", "Manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have enough privilege" });
    }

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.aggregate([
      {
        $match: {}, // Filtre pour correspondre à toutes les commandes
      },
      {
        $lookup: {
          from: "customers", // Nom de la collection ou table des clients
          localField: "customer_id",
          foreignField: "_id", // Changer "id" en "_id" si c'est l'ID
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $group: {
          _id: "$_id",
          customerID: { $first: "$customer_id" },
          customerFirstName: { $first: "$customerInfo.first_name" },
          customerLastName: { $first: "$customerInfo.last_name" },
          itemsTotal: { $sum: { $size: "$order_items" } },
          orderDate: { $first: "$order_date" },
          cartTotalPrice: { $first: "$cart_total_price" },
          status: { $first: "$status" },
        },
      },
      { $sort: { orderDate: -1 } }, // Triez par date de commande décroissante
      { $skip: skip },
      { $limit: limit },
    ]);

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // Vérifier les privilèges de l'utilisateur
    if (!["Admin", "Manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have enough privilege" });
    }

    const orderId = req.params.id;

    const order = await Order.aggregate([
      {
        $match: {
          _id: orderId, // Filtrer par ID de commande
        },
      },
      {
        $lookup: {
          from: "customers", // Nom de la collection ou table des clients
          localField: "customer_id",
          foreignField: "_id", // Changer "id" en "_id" si c'est l'ID
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $group: {
          _id: "$_id",
          customerID: { $first: "$customer_id" },
          customerFirstName: { $first: "$customerInfo.first_name" },
          customerLastName: { $first: "$customerInfo.last_name" },
          itemsTotal: { $sum: { $size: "$order_items" } },
          orderDate: { $first: "$order_date" },
          cartTotalPrice: { $first: "$cart_total_price" },
          status: { $first: "$status" },
        },
      },
    ]);

    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ data: order[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    // Vérifier les privilèges de l'utilisateur
    if (!["Admin", "Manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have enough privilege" });
    }

    const orderId = req.params.id;
    const newStatus = req.body.status;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = newStatus;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};