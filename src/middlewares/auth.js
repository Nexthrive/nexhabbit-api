const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const auth = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Get token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
