const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema({
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
  scheduleDate: {
    type: Date,
    required: true,
  },
  scheduleDateEnd: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validates time format HH:mm (24-hour)
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validates time format HH:mm (24-hour)
  },
});
scheduleSchema.virtual("schedule", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "scheduleId",
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
