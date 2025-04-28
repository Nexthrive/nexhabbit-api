const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
});

userSchema.virtual("sentFriendRequests", {
  ref: "Friend",
  localField: "_id",
  foreignField: "friendId",
});

userSchema.virtual("receivedFriendRequests", {
  ref: "Friend",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("schedules", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "userId",
});
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(100).required(),
  });
  return schema.validate(user);
}

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
const User = mongoose.model("User", userSchema);
module.exports = User;
module.exports.validate = validateUser;
