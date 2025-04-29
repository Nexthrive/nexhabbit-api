const express = require("express");
const router = express.Router();
const {
  createTodoItem,
  deleteTodoItem,
  updateTodoItem,
  getTodoItemById,
  getTodoItems,
} = require("../controllers/todoItemController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.delete("/deleteTodoItem", auth, deleteTodoItem);
router.get("/getTodoItems", auth, getTodoItems);
router.post("/createTodoItem", auth, createTodoItem);
router.patch("/updateTodoItem", auth, updateTodoItem);
router.get("/getTodoItemById", auth, getTodoItemById);

module.exports = router;
