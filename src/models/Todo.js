const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);
scheduleSchema.virtual("todo", {
  ref: "Todo",
  localField: "_id",
  foreignField: "todoId",
});
module.exports = mongoose.model("Todo", TodoSchema);
