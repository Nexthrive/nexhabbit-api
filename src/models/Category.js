const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);
CategorySchema.virtual("schedule", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "categoryId",
});
CategorySchema.virtual("note", {
  ref: "Note",
  localField: "_id",
  foreignField: "categoryId",
});
module.exports = mongoose.model("Category", CategorySchema);
