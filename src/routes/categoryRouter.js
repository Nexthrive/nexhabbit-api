const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategoryById,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.delete("/deleteCategory/:id", deleteCategory);
router.patch("/updateCategory/:id", auth, updateCategory); // Apply auth middleware to protect this route
router.post("/createCategory", createCategory);
router.get("/getCategories", getCategories);
router.get("/getCategory/:id", getCategoryById);

module.exports = router;
