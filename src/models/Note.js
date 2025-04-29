const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

// Add pre-save hook to validate references
NoteSchema.pre("save", async function (next) {
  try {
    // Check if userId exists
    const User = mongoose.model("User");
    const userExists = await User.findById(this.userId);
    if (!userExists) {
      throw new Error("Referenced user does not exist");
    }

    // Check if categoryId exists (if provided)
    if (this.categoryId) {
      const Category = mongoose.model("Category");
      const categoryExists = await Category.findById(this.categoryId);
      if (!categoryExists) {
        throw new Error("Referenced category does not exist");
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Note", NoteSchema);
