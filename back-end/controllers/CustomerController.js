const Customer = require("../models/CustomerModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Customer Authentication
exports.login = async (req, res, next, customer, info) => {
  if (!customer) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!customer.active) {
    return res.status(401).json({ message: "Customer is not active" });
  }

  customer.last_login = new Date();

  try {
    await customer.save();

    const token = jwt.sign(
      {
        sub: customer._id,
        role: "Customer",
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        creation_date: customer.creation_date,
        last_login: customer.last_login,
        valid_account: customer.valid_account,
        active: customer.active,
      },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("jwt", token, { httpOnly: true });

    req.logIn(customer, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Login successful", token });
    });
  } catch (err) {
    return next(err);
  }
};

// Create Customer Account
exports.createCustomerAccount = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with the same email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      creation_date: new Date(),
      last_login: null,
      valid_account: false, // Account starts as not validated
      active: true,
    });

    await newCustomer.save();

    // Check if the customer's email has been previously validated
    if (!newCustomer.valid_account) {
      // Send a validation email
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const validationLink = `${process.env.APP_URL}/v1/customers/validate/${newCustomer._id}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Validate Account",
        html: `<p>Your account has been created. Please click the button below to validate your email:</p>
        <a href="${validationLink}"><button>Validate Email</button></a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email could not be sent:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    res.status(201).json({ message: "Customer account created successfully" });
  } catch (error) {
    next(error);
  }
};

// List or Search Customers
exports.listOrSearchCustomers = async (req, res) => {
  try {
    const { query, page, limit = 10, sort } = req.query;
    const rolesAllowedToAccess = ["Admin", "Manager"];

    // Check if the user's role is allowed to access this functionality
    if (!rolesAllowedToAccess.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have the required role." });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const sortDirection = sort === "DESC" ? -1 : 1;
    const sortField = "creation_date"; // Sort by 'creation_date' field

    const searchFilter = {
      $or: [
        { first_name: { $regex: query, $options: "i" } },
        { last_name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    // Check if a query exists to determine whether to list or search for users
    const customersQuery = query
      ? Customer.find(searchFilter)
      : Customer.find();

    const customers = await customersQuery
      .skip(skip)
      .limit(limitNumber)
      .sort({ [sortField]: sortDirection });

    const totalCustomers = query
      ? await Customer.countDocuments(searchFilter)
      : await Customer.countDocuments();

    res.status(200).json({ customers, totalCustomers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!["Admin", "Manager"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have the required role." });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Customer Data by ID
exports.updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have the required role." });
    }

    const { email, first_name, last_name, active } = req.body;

    const existingCustomerWithEmail = await Customer.findOne({
      email,
      _id: { $ne: id },
    });

    if (existingCustomerWithEmail) {
      return res
        .status(400)
        .json({ message: "Customer with the same email already exists" });
    }

    customer.email = email;
    customer.first_name = first_name;
    customer.last_name = last_name;
    customer.active = active;

    await customer.save();

    res.status(200).json({ message: "Customer data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Customer Account by ID
exports.deleteCustomerById = async (req, res) => {
  try {
    if (req.user.role !== "Customer") {
      return res
        .status(403)
        .json({ message: "Only customers can delete their own accounts" });
    }

    const customerId = req.params.id;
    const deletedCustumer = await Customer.findByIdAndRemove(customerId);

    if (!deletedCustumer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer account deleted successfully",
      deletedCustumer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Customer's Profile
exports.getCustomerProfile = (req, res) => {
  if (req.user.role !== "Customer") {
    return res
      .status(403)
      .json({ message: "Access denied. You do not have the required role." });
  }

  const customerProfile = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    creation_date: req.user.creation_date,
    last_login: req.user.last_login,
    valid_account: req.user.valid_account,
    active: req.user.active,
  };

  res.status(200).json(customerProfile);
};

exports.updateCustomerProfile = async (req, res) => {
  try {
    const id = req.user.sub; // Get the customer's ID from the authenticated user
    // Check if the provided data includes fields that should be updated
    const { email, first_name, last_name } = req.body;

    // Find the customer by their ID
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    // console.log(id,customer._id.toString());
    // Check if the customer is trying to update their own data
    if (id !== customer._id.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only update your own data." });
    }
    // Check if the customer is trying to update their email, and if it's unique
    if (email && email !== customer.email) {
      const existingCustomerWithEmail = await Customer.findOne({ email });

      if (existingCustomerWithEmail) {
        return res
          .status(400)
          .json({ message: "Customer with the same email already exists" });
      }

      // Update the email
      customer.email = email;
    }

    // Update other fields (first_name, last_name, etc.) if provided
    if (first_name) {
      customer.first_name = first_name;
    }

    if (last_name) {
      customer.last_name = last_name;
    }

    // Save the updated customer data
    await customer.save();

    res.status(200).json({ message: "Customer data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//validate customer account
exports.validateCustomerAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the customer by their ID
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the customer's email was validated
    if (!customer.valid_account) {
      // Set the valid account status to true
      customer.valid_account = true;
      // Save the updated customer
      await customer.save();
      return res.status(200).json({ message: "Customer account validated successfully" });
    }

    return res.status(200).json({ message: "Customer account is already validated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      // Handle any potential errors here
      return res.status(500).json({ message: "Error during logout" });
    }
    res.clearCookie("jwt"); // Clear the JWT cookie
    res.status(200).json({ message: "Logout successful" });
  });
};
