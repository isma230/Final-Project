const mongoose = require('mongoose');

// Define the schema for the "categories" collection
const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true, // Ensures that category names are unique
  },
  active: {
    type: Boolean,
    default: false, // Default value is false (not active)
  },
});

// Create a Mongoose model for the "Category" collection using the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
