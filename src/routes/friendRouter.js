const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  getFriends,
  acceptFriendRequest,
  unFriend,
  cancelFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriendRequestsCount,
  getSentFriendRequestsCount
} = require("../controllers/friendController");
const auth = require("../middlewares/auth");

// Apply auth middleware to protect these routes
router.post("/sendFriendRequest", auth, sendFriendRequest);
router.post("/acceptFriendRequest", auth, acceptFriendRequest);
router.post("/rejectFriendRequest", auth, rejectFriendRequest);
router.post("/cancelFriendRequest", auth, cancelFriendRequest);
router.get("/getFriends", auth, getFriends);
router.get("/getFriendRequests", auth, getFriendRequests);
router.get("/getFriendRequestsCount", auth, getFriendRequestsCount);
router.get("/getSentFriendRequestsCount", auth, getSentFriendRequestsCount);
router.post("/unFriend", auth, unFriend);

module.exports = router;
