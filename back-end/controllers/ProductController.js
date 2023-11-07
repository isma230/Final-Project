const Product = require("../models/ProductModel");
const Subcategory = require("../models/SubCategoryModel");
const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
// Function to create a new product
exports.createProduct = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({ message: 'Only admin and manager users can create products' });
    }
    const {
      fields, // Contains non-file fields
      files,  // Contains uploaded files
    } = req;
    // Check if the product name is unique
    const { product_name } = fields;
    const existingProductByName = await Product.findOne({ product_name });
    if (existingProductByName) {
      return res.status(400).json({ message: 'Product name already exists' });
    }

    // Check if the subcategory ID is valid
    const { subcategory_id } = fields;
    const existingSubcategory = await Subcategory.findById(subcategory_id);
    if (!existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory ID is invalid' });
    }

    // Generate the SKU based on the provided logic
    const sku = `${product_name.substring(0, 3)}-${subcategory_id}`;
    // Check if the SKU is unique
    const existingProductBySKU = await Product.findOne({ sku });
    if (existingProductBySKU) {
      return res.status(400).json({ message: 'Product SKU already exists' });
    }

    const imageFile = files.product_image.path.split('/').pop(); // Extract the filename
    // Create a new product with default active status (false)
    const newProduct = new Product({
      product_name,
      sku,
      product_image: imageFile, // Use the path of the uploaded file
      subcategory_id,
      short_description: fields.short_description,
      long_description: fields.long_description,
      price: fields.price,
      discount_price: fields.discount_price,
      options: fields.options,
    });

    // Save the product
    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


// Function to get products (search or list)
exports.listProducts = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 10;

    // Calculate the skip value based on the page and perPage
    const skip = (page - 1) * perPage;

    const aggregateQuery = [
      {
        $skip: skip, // Skip the required number of documents
      },
      {
        $limit: perPage, // Limit the number of documents to retrieve
      },
      {
        $lookup: {
          from: 'subcategories', // The name of the subcategories collection
          localField: 'subcategory_id',
          foreignField: '_id',
          as: 'subcategory',
        },
      },
      {
        $unwind: '$subcategory', // Convert the subcategory array into an object
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          categoryName: '$subcategory.subcategory_name', // Include the subcategory name
          product_name: 1,
          product_image: 1,
          long_description: 1,
          short_description: 1,
          discount_price: 1,
          options: 1,
          active: 1,
          price: 1,
        },
      },
    ];
    

    const products = await Product.aggregate(aggregateQuery);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Function to search products
exports.searchProducts = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const skip = (page - 1) * perPage;

    // Parse the search query
    const searchQuery = req.query.query;

    const aggregateQuery = [
      {
        $match: {
          product_name: { $regex: new RegExp(searchQuery, 'i') }, // Case-insensitive search
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: perPage,
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subcategory_id',
          foreignField: '_id',
          as: 'subcategory',
        },
      },
      {
        $unwind: '$subcategory',
      },
      {
        $project: {
          _id: 0,
          product_name: 1,
          product_image: 1,
          long_description: 1,
          short_description: 1,
          discount_price: 1,
          options: 1,
          active: 1,
          price: 1,
          categoryName: '$subcategory.subcategory_name',
        },
      },
    ];

    const products = await Product.aggregate(aggregateQuery);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


// Function to get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed in the request params

    const aggregateQuery = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: 'subcategories', // The name of the subcategories collection
          localField: 'subcategory_id',
          foreignField: '_id',
          as: 'subcategory',
        },
      },
      {
        $unwind: '$subcategory',
      },
      {
        $lookup: {
          from: 'categories', // The name of the categories collection
          localField: 'subcategory.category_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          product_name: 1,
          product_image: 1,
          long_description: 1,
          short_description: 1,
          discount_price: 1,
          options: 1,
          active: 1,
          price: 1,
          categoryName: '$category.category_name',
          subcategoryName: '$subcategory.subcategory_name',
        },
      },
    ];

    const product = await Product.aggregate(aggregateQuery);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product[0]); // Assuming you expect a single product
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Function to update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({ message: 'Only admin and manager users can update products' });
    }

    const productId = req.params.id; // Assuming the product ID is passed in the request params

    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { fields, files } = req;
    const {
      product_name,
      subcategory_id,
      short_description,
      long_description,
      price,
      discount_price,
      options,
    } = fields; // Extract fields from req.body

    // Check if the updated product name is unique
    if (product_name && product_name !== existingProduct.product_name) {
      const existingProductByName = await Product.findOne({ product_name });
      if (existingProductByName) {
        return res.status(400).json({ message: 'Product name already exists' });
      }
    }

    // Check if the subcategory ID is valid
    if (subcategory_id) {
      const existingSubcategory = await Subcategory.findById(subcategory_id);
      if (!existingSubcategory) {
        return res.status(400).json({ message: 'Subcategory ID is invalid' });
      }
    }

    // Update the product data
    const updatedData = {
      product_name: product_name || existingProduct.product_name,
      subcategory_id: subcategory_id || existingProduct.subcategory_id,
      short_description: short_description || existingProduct.short_description,
      long_description: long_description || existingProduct.long_description,
      price: price || existingProduct.price,
      discount_price: discount_price || existingProduct.discount_price,
      options: options || existingProduct.options,
      active: fields.active || existingProduct.active,
    };

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Function to delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({ message: 'Only admin and manager users can delete products' });
    }

    const productId = req.params.id; // Assuming the product ID is passed in the request params

    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the product image
    if (existingProduct.product_image) {
      // Extract the filename from the path
      const imagePath = existingProduct.product_image;
      const imageFilename = path.basename(imagePath);

      // Delete the image file using fs.unlink
      fs.unlink(`productsimages/${imageFilename}`, (err) => {
        if (err) {
          console.error(`Error deleting image: ${err}`);
        }
      });
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product and image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

