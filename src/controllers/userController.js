const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Validate user input
    const { error } = User.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Return user data and token
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.email }],
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
      message: "Login Success",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
