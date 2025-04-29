const express = require("express");
const router = express.Router();
const {
  deleteNote,
  getNotes,
  createNote,
  updateNote,
  getNoteById,
} = require("../controllers/noteController.js");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.delete("/deleteNote", auth, deleteNote);
router.get("/getNotes", auth, getNotes);
router.post("/createNote", auth, createNote);
router.patch("/updateNote", auth, updateNote);
router.get("/getNoteById", auth, getNoteById);

module.exports = router;
