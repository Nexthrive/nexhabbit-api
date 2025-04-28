const Friend = require("../models/Friend.js");

const getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({
      userId: req.user._id,
      status: "accepted",
    }).populate("friendId", "username");
    res.status(200).json(friends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  try {
    const friend = await Friend.findOne({
      userId: req.user._id,
      friendId,
    });
    if (friend) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    const newFriend = new Friend({
      userId: req.user._id,
      friendId,
      status: "pending",
    });
    await newFriend.save();
    res.status(201).json(newFriend);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
module.exports = {
  getFriends,
  sendFriendRequest,
};
