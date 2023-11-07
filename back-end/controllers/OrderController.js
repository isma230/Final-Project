const Order = require('../models/OrderModel');
const Customer = require('../models/CustomerModel');
const mongoose = require('mongoose');
// Function to create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customer_id, order_items, cart_total_price } = req.body;

    // Check if the customer is authenticated
    if (!req.user.role==="Customer") {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the customer's email is validated
    if (!req.user.valid_account) {
      return res.status(403).json({ message: 'Customer email is not validated' });
    }

    // Create a new order
    const order = new Order({
      customer_id: req.user.sub,
      order_items,
      cart_total_price,
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({ message: 'Only admin and manager users can list orders' });
    }

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const orders = await Order.aggregate([
      {
        $skip: skip,
      },
      {
        $limit: perPage,
      },
      {
        $lookup: {
          from: 'costumers', // Name of the customers collection
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      {
        $unwind: '$customerInfo',
      },
      {
        $project: {
          _id: 1,
          customer_id: 1,
          order_date: 1,
          cart_total_price: 1,
          status: 1,
          customerFirstName: '$customerInfo.first_name',
          customerLastName: '$customerInfo.last_name',
          itemsTotal: { $size: '$order_items' },
        },
      },
      { $sort: { order_date: -1 } },
    ]);

    res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    // Check user privileges
    if (!["Admin", "Manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have enough privilege" });
    }

    const orderId = req.params.id;

    const order = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "costumers", // Name of the customers collection
          localField: "customer_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $project: {
          _id: 1,
          customerID: "$customer_id",
          customerFirstName: "$customerInfo.first_name",
          customerLastName: "$customerInfo.last_name",
          itemsTotal: { $size: "$order_items" },
          orderDate: 1,
          cartTotalPrice: 1,
          status: 1,
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
    const newOrderItems = req.body.order_items;
    const newCartTotalPrice = req.body.cart_total_price;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.order_items = newOrderItems;
    order.cart_total_price = newCartTotalPrice;
    order.status = newStatus;
    order.order_date = Date.now();
    await order.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};