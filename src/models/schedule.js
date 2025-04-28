const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    privacy: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // userId should be required since each schedule needs an owner
    },
    todoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  },
  {
    timestamps: true, // Add timestamps for better tracking
  }
);

// Virtual for category relationship
scheduleSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId", // Should be categoryId instead of _id
  foreignField: "_id", // Should reference Category _id
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
