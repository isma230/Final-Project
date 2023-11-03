const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res, next, user, info) => {
  // Check if the user is not found
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check if the user is not active
  if (!user.active) {
    return res.status(401).json({ message: 'User is not active' });
  }

  // If the user is found and active, proceed to update the last login date
  user.last_login = new Date();

  try {
    // Save the user with the updated last login date
    await user.save();

     // Generate a JWT token
    const token = jwt.sign({ sub: user._id , role: user.role }, process.env.JWT_SECRET_KEY);
    res.cookie('jwt', token, { httpOnly: true, secure: false}); 
    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Login successful', token });
    });
  } catch (err) {
    return next(err);
  }
};

// Create User (accessible only to Admin users)
exports.createUser = async (req, res, next) => {
    try {

      // Check if the requesting user has the admin role
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admin users can create new users' });
      }
       
      const { first_name, last_name, email, user_name, password, role } = req.body;
  
      // Check if the user with the same email or username already exists
      const existingUser = await User.findOne({ $or: [{ email }, { user_name }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User with the same email or username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        first_name,
        last_name, 
        email,
        user_name,
        password: hashedPassword,
        role,
        creation_date: new Date(), // Set creation date
        last_login: null,
        last_update: null,
        active: true, // User account is active by default
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Send a notification email to the user with their credentials
      const transporter = nodemailer.createTransport({
        // Configure your email service provider here (e.g., SMTP, Gmail, etc.)
        service: process.env.EMAIL_HOST,
        auth: { 
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
          
        },
      });
  
      const mailOptions = {
        from:process.env.EMAIL_USER,
        to: newUser.email,
        subject: 'Account Created',
        text: `Your account has been created with the following credentials:\n
        firstName: ${newUser.first_name}\n
        lastName: ${newUser.last_name}\n
        Username: ${newUser.user_name}\n
        email: ${newUser.email}\n
        Password: ${password}\n
        role: ${newUser.role}\n
        `, 
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error('Email could not be sent:', error);
        }
        console.log('Email sent:', info.response);
      });
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  };
 
// list or search users  
exports.listOrSearchUsers = async (req, res) => {
    try {
      const { query, page, limit = 10, sort } = req.query;
      const rolesAllowedToAccess = ['Admin', 'Manager'];
  
      // Check if the user's role is allowed to access this functionality
      if (!rolesAllowedToAccess.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
      }
  
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;
  
      const sortDirection = sort === 'DESC' ? -1 : 1;
      const sortField = 'creation_date'; // Sort by 'creation_date' field
  
      // Define a search filter using a regular expression for the query
      const searchFilter = {
        $or: [
          { first_name: { $regex: query, $options: 'i' } },
          { last_name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { user_name: { $regex: query, $options: 'i' } },
        ],
      };
  
      // Check if a query exists to determine whether to list or search for users
      const usersQuery = query ? User.find(searchFilter) : User.find();
  
      const users = await usersQuery
        .skip(skip)
        .limit(limitNumber)
        .sort({ [sortField]: sortDirection });
  
      const totalUsers = query ? await User.countDocuments(searchFilter) : await User.countDocuments();
  
      res.status(200).json({ users, totalUsers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Get user by ID
exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const allowedRoles = ['Admin', 'Manager'];
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
      }
  
      // Return the user's details if the role is allowed
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Update user by ID
exports.updateUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
      }
  
      const { user_name, email, first_name, last_name, role, active } = req.body;
  
      // Check if the user username is unique
      const existingUserWithUsername = await User.findOne({ user_name, _id: { $ne: id } });
      if (existingUserWithUsername) {
        return res.status(400).json({ message: 'User with the same username already exists' });
      }
  
      // Check if the user email is unique
      const existingUserWithEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: 'User with the same email already exists' });
      }
  
      // Update the user's data and set the last update date
      user.user_name = user_name;
      user.email = email;
      user.first_name = first_name;
      user.last_name = last_name;
      user.role = role;
      user.active = active;
      user.last_update = new Date();
  
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    // Check if the requesting user has the admin role
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admin users can delete users' });
    }

    // Extract the user ID from the request parameters
    const userId = req.params.id;

    // Use Mongoose to find and delete the user by ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Logout
exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      // Handle any potential errors here
      return res.status(500).json({ message: 'Error during logout' });
    }
    res.clearCookie('jwt'); // Clear the JWT cookie
    res.status(200).json({ message: 'Logout successful' });
  });
};
