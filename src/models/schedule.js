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
    ref: "Category", // Reference to the Category model
  },
  privacy: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  todoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo", // Reference to the Todo model
  },
});
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
