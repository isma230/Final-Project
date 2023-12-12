const Category = require('../models/CategoryModel'); // Import the Category model
const Subcategory = require('../models/SubCategoryModel'); // Import the Subcategory model
// Function to create a new category
exports.createCategory = async (req, res) => {
  try {
    // Check if the user has the admin or manager role
    const userRole = req.user.role; // Assuming you have user roles in your request

    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return res.status(403).json({ message: 'Only admin and manager users can create categories' });
    }

    const { category_name } = req.body;

    // Check if the category name is unique
    const existingCategory = await Category.findOne({ category_name });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    // Create a new category with default active status (false)
    const newCategory = new Category({
      category_name,
    });

    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// List or Search Categories
exports.listOrSearchCategories = async (req, res) => {
    try {
      const { query, page, limit = 10 } = req.query;
      // const rolesAllowedToAccess = ["Admin", "Manager"];
  
      // // Check if the user's role is allowed to access this functionality
      // if (!rolesAllowedToAccess.includes(req.user.role)) {
      //   return res
      //     .status(403)
      //     .json({ message: "Access denied. You do not have the required role." });
      // }
  
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;
    
      const searchFilter = {
        category_name: { $regex: query, $options: "i" },
      };
  
      // Check if a query exists to determine whether to list or search for categories
      const categoriesQuery = query
        ? Category.find(searchFilter)
        : Category.find();
  
      const categories = await categoriesQuery
        .skip(skip)
        .limit(limitNumber);

        // Check if there are no categories found and return an empty array
    if (categories.length === 0) {
        return res.status(200).json({ categories: [], totalCategories: 0 });
      }
  
      const totalCategories = query
        ? await Category.countDocuments(searchFilter)
        : await Category.countDocuments();
  
      res.status(200).json({ categories, totalCategories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Get Category by ID
exports.getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      if (!["Admin", "Manager"].includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied. You do not have the required role." });
      }
  
      res.status(200).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Update Category Data by ID
exports.updateCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      if (req.user.role !== "Admin" && req.user.role !== "Manager") {
        return res
          .status(403)
          .json({ message: "Access denied. You do not have the required role." });
      }
  
      const { category_name, active } = req.body;
  
      const existingCategoryWithName = await Category.findOne({
        category_name,
        _id: { $ne: id },
      });
  
      if (existingCategoryWithName) {
        return res
          .status(400)
          .json({ message: "Category with the same name already exists" });
      }
  
      category.category_name = category_name;
      category.active = active;
  
      await category.save();
  
      res.status(200).json({ message: "Category data updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Delete Category by ID
exports.deleteCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      if (req.user.role !== "Admin" && req.user.role !== "Manager") {
        return res
          .status(403)
          .json({ message: "Access denied. You do not have the required role." });
      }
      
      //check if there are subcategories with this category_id
      const subcategories = await Subcategory.find({category_id: id});
      if (subcategories.length > 0) {
        return res.status(400).json({ message: "Cannot delete category with attached subcategory" });
      }
  
      await Category.findByIdAndRemove(id);
  
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
