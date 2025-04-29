const mongoose = require("mongoose");

const TodoItemSchema = new mongoose.Schema(
  {
    todoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Todo",
    },
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
TodoItemSchema.virtual("todo", {
  ref: "Todo",
  localField: "_id",
  foreignField: "todoId",
});
module.exports = mongoose.model("TodoItem", TodoItemSchema);
