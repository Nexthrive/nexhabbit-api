const Schedule = require("../models/schedule");
const Todo = require("../models/Todo");
const TodoItem = require("../models/todoItem");
const Friend = require("../models/Friend");

const createSchedule = async (req, res) => {
  const { categoryId } = req.body;

  const schedule = new Schedule({
    title: req.body.title,
    desc: req.body.desc,
    scheduleDate: req.body.scheduleDate,
    scheduleDateEnd: req.body.scheduleDateEnd,

    startTime: req.body.start,

    categoryId: categoryId,
    privacy: req.body.privacy,
    endTime: req.body.end,
    userId: req.user._id,
  });
  try {
    const savedSchedule = await schedule.save();
    res.json(savedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const editSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    // Find the schedule first to check if it exists
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    // Find all associated todos
    const todos = await Todo.find({ scheduleId: req.params.id });

    // For each todo, delete its associated todoItems first
    for (const todo of todos) {
      // Delete all todoItems associated with this todo
      await TodoItem.deleteMany({ todoId: todo._id });

      // Delete the todo itself
      await Todo.findByIdAndDelete(todo._id);
    }

    // Finally delete the schedule
    await Schedule.findByIdAndDelete(req.params.id);

    res.json({ message: "Schedule and associated items deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user._id });
    if (!schedules.length)
      return res.status(404).json({ error: "No schedules found" });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getFriendSchedule = async (req, res) => {
  try {
    // First, get all accepted friendships where the current user is involved
    const friendships = await Friend.find({
      $or: [
        { userId: req.user._id, status: "accepted" },
        { friendId: req.user._id, status: "accepted" },
      ],
    });

    // Extract friend IDs from the friendships
    const friendIds = friendships.map((friendship) =>
      friendship.userId.toString() === req.user._id.toString()
        ? friendship.friendId
        : friendship.userId
    );

    // Find public schedules from these friends
    const schedules = await Schedule.find({
      userId: { $in: friendIds },
      privacy: false,
    });

    if (!schedules.length)
      return res
        .status(404)
        .json({ error: "No public schedules found from your friends" });

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createSchedule,
  editSchedule,
  deleteSchedule,
  getSchedule,
  getFriendSchedule,
};
