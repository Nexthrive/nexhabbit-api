const express = require("express");
const router = express.Router();
const { createCategory, getCategoryById, getCategories, } = require("../controllers/categoryController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.post("/createCategory", createCategory);
router.get("/getCategories", getCategories);
router.get("/getCategory/:id", getCategoryById);


module.exports = router;

