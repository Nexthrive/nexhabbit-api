const express = require("express");
const router = express.Router();
const { sendFriendRequest, getFriends } = require("../controllers/friendController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.post("/sendFriendRequest", auth, sendFriendRequest);
router.get("/", auth, getFriends);

module.exports = router;
