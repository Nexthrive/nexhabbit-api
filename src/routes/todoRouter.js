const express = require("express");
const router = express.Router();
const {
  deleteTodo,
  getTodos,
  createTodo,
  updateTodo,
  getTodoById,
} = require("../controllers/todoController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.delete("/deleteTodo", auth, deleteTodo);
router.get("/getTodo", auth, getTodos);
router.post("/createTodo", auth, createTodo);
router.patch("/updateTodo", auth, updateTodo);
router.get("/getTodoById", auth, getTodoById);

module.exports = router;
