const Subcategory = require('../models/SubCategoryModel'); // Import your Subcategory model
const Product = require('../models/ProductModel'); // Import your Product model
// Function to create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    // Check if the user has the admin or manager role
    const userRole = req.user.role; // Assuming you have user roles in your request

    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({ message: 'Only admin and manager users can create subcategories' });
    }

    const { subcategory_name, category_id } = req.body;

    // Check if the subcategory name is unique
    const existingSubcategory = await Subcategory.findOne({ subcategory_name });

    if (existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory name already exists' });
    }

    // Create a new subcategory with default active status (false)
    const newSubcategory = new Subcategory({
      subcategory_name,
      category_id,
    });

    await newSubcategory.save();

    res.status(201).json({ message: 'Subcategory created successfully', subcategory: newSubcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// List or Search Subcategories
exports.listOrSearchSubcategories = async (req, res) => {
  try {
    const { query, page, limit = 10 } = req.query;
    const rolesAllowedToAccess = ["Admin", "Manager"];

    // Check if the user's role is allowed to access this functionality
    if (!rolesAllowedToAccess.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const searchFilter = {
      subcategory_name: { $regex: query, $options: "i" },
    };

    // Check if a query exists to determine whether to list or search for subcategories
    const subcategoriesQuery = query
      ? Subcategory.find(searchFilter)
      : Subcategory.find();

    const subcategories = await subcategoriesQuery
      .skip(skip)
      .limit(limitNumber);

    // Check if there are no subcategories found and return an empty array
    if (subcategories.length === 0) {
      return res.status(200).json({ subcategories: [], totalSubcategories: 0 });
    }

    const totalSubcategories = query
      ? await Subcategory.countDocuments(searchFilter)
      : await Subcategory.countDocuments();

    res.status(200).json({ subcategories, totalSubcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (!["Admin", "Manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Subcategory Data by ID
exports.updateSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    const { subcategory_name, active } = req.body;

    const existingSubcategoryWithName = await Subcategory.findOne({
      subcategory_name,
      _id: { $ne: id },
    });

    if (existingSubcategoryWithName) {
      return res.status(400).json({ message: "Subcategory with the same name already exists" });
    }

    subcategory.subcategory_name = subcategory_name;
    subcategory.active = active;

    await subcategory.save();

    res.status(200).json({ message: "Subcategory data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Subcategory by ID
exports.deleteSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);

    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check if subcategory has attached products
    const productsWithSubcategoryId = await Product.find({ subcategory_id: id });

    if (productsWithSubcategoryId.length > 0) {
      return res.status(400).json({ message: "Cannot delete subcategory with attached products" });
    }

    await Subcategory.findByIdAndRemove(id);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

