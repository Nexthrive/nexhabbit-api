const express = require("express");
const router = express.Router();
const {
  createSchedule,
  editSchedule,
  deleteSchedule,
  getSchedule,
  getFriendSchedule,
} = require("../controllers/scheduleController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect this route
router.post("/createSchedule", auth, createSchedule);
router.get("/getSchedule", auth, getSchedule);
router.get("/getFriendSchedule", auth, getFriendSchedule);

router.patch("/editSchedule/:id", auth, editSchedule);
router.delete("/deleteSchedule/:id", auth, deleteSchedule);

module.exports = router;
