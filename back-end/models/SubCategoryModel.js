const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    subcategory_name: {
    type: String,
    unique: true,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;