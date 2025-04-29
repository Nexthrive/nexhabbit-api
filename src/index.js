const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Emo
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const friendRoutes = require("./routes/friendRouter");
app.use("/api/friends", friendRoutes);
const scheduleRouter = require("./routes/scheduleRouter");
app.use("/api/schedule", scheduleRouter);

// Not Emo
const categroyRoutes = require("./routes/categoryRouter");
app.use("/api/category", categroyRoutes);
const todoRouter = require("./routes/todoRouter");
app.use("/api/todo", todoRouter);
const todoItemRouter = require("./routes/todoItemsRouter");
app.use("/api/todoItem", todoItemRouter);
const noteRouter = require("./routes/noteRouter");
app.use("/api/noteRouter", noteRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
