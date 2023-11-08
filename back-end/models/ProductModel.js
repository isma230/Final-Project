const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  product_image: { type: String , required: true },
  product_name: { type: String, required: true },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory", // Reference to the Subcategory model
    required: true,
  },
  short_description: { type: String },
  long_description: { type: String },
  price: { type: Number, required: true },
  discount_price: { type: Number },
  options: { type: [String] },
  active: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
