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
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
  },
  { timestamps: true }
);
TodoSchema.virtual("todo", {
  ref: "Todo",
  localField: "_id",
  foreignField: "todoId",
});
TodoSchema.pre("save", async function (next) {
  try {
    const Schedule = mongoose.model("Schedule");
    const scheduleExists = await Schedule.findById(this.scheduleId);
    if (!scheduleExists) {
      throw new Error("Referenced schedule does not exist");
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Todo", TodoSchema);
