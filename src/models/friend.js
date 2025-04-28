const mongoose = require("mongoose");
const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;
