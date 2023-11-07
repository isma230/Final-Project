const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  order_items: {
    type: [Object], // Vous pouvez ajuster le schéma d'objet selon les besoins
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now(),
  },
  cart_total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Shipped', 'Paid', 'Closed', 'Canceled'],
    default: 'Open',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
