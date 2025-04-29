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
    startTime: {
      type: datetime,
      required: true,
    },
    endTime: {
      type: datetime,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps for better tracking
  }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
