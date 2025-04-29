const Schedule = require("../models/schedule");

const createSchedule = async (req, res) => {
  const schedule = new Schedule({
    title: req.body.title,
    desc: req.body.desc,
    start: req.body.start,
    end: req.body.end,
    userId: req.body.userId,
    todoId: req.body.todoId,
  });
  try {
    const savedSchedule = await schedule.save();
    res.json(savedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
