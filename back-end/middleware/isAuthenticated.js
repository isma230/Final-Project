const jwt = require("jsonwebtoken");
// Middleware to check if a user is connected (authenticated)
const isAuthenticated = (req, res, next) => {
  // Get the token from the "access_token" cookie
  const token = req.cookies.jwt;

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    // Verify the token with your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Replace with your secret key
    // Attach user data from the token to the request
    req.user = decoded;
    const userId = decoded.sub; // Get the user ID from the payload
    const userRole = decoded.role; // Get the user role from the payload
    next(); // User is authenticated
  } catch (error) {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = isAuthenticated;
