const Note = require("../models/Note");
const User = require("../models/User");
const Category = require("../models/Category");

exports.createNote = async (req, res) => {
  try {
    if (req.body.categoryId) {
      const categoryExists = await Category.findById(req.body.categoryId);
      if (!categoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      categoryId: req.body.categoryId,
      userId: req.user._id, // Get userId from authenticated user
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    
    if (notes.length === 0) {
      return res.json({ message: "no notes found" });
    }
    
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
