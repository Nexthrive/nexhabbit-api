const Friend = require("../models/Friend.js");

const getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({
      $or: [
        {
          userId: req.user._id,
          friendId: { $ne: req.user._id },
          status: "accepted",
        },
        {
          friendId: req.user._id,
          userId: { $ne: req.user._id },
          status: "accepted",
        },
      ],
    })
      .populate("friendId", "username")
      .populate("userId", "username");

    const formattedFriends = friends.map((friendship) => {
      const isFriend =
        friendship.userId._id.toString() === req.user._id.toString()
          ? friendship.friendId
          : friendship.userId;

      return {
        friendshipId: friendship._id,
        friend: {
          _id: isFriend._id,
          username: isFriend.username,
        },
        status: friendship.status,
      };
    });

    const friendCount = formattedFriends.length;

    const response = {
      friends: formattedFriends,
      totalFriends: friendCount,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  try {
    if (req.user._id.toString() === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const alreadyFriends = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId: friendId, status: "accepted" },
        { userId: friendId, friendId: req.user._id, status: "accepted" },
      ],
    });

    if (alreadyFriends) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    const canceledRequest = await Friend.findOne({
      userId: req.user._id,
      friendId,
      status: "canceled",
    });

    if (canceledRequest) {
      const userTimezoneOffset = req.headers["timezone-offset"]
        ? parseInt(req.headers["timezone-offset"])
        : 0;

      const canceledAt = canceledRequest.canceledAt || new Date(0);

      const userLocalCanceledAt = new Date(
        canceledAt.getTime() - userTimezoneOffset * 60000
      );

      const cooldownPeriod = 7 * 24 * 60 * 60 * 1000;
      const cooldownEnds = new Date(
        userLocalCanceledAt.getTime() + cooldownPeriod
      );

      const currentTime = new Date();
      const userLocalCurrentTime = new Date(
        currentTime.getTime() - userTimezoneOffset * 60000
      );

      if (userLocalCurrentTime < cooldownEnds) {
        const remainingMs = cooldownEnds - userLocalCurrentTime;
        const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
        const remainingHours = Math.ceil(
          (remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
        );

        return res.status(400).json({
          message: `You cannot send a friend request to this user for ${remainingDays} more day(s) and ${remainingHours} hour(s) due to a previous cancellation.`,
          cooldownEnds: cooldownEnds.toISOString(),
        });
      } else {
        await Friend.deleteOne({ _id: canceledRequest._id });
      }
    }

    const existingSentRequest = await Friend.findOne({
      userId: req.user._id,
      friendId,
    });

    if (existingSentRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const existingReceivedRequest = await Friend.findOne({
      userId: friendId,
      friendId: req.user._id,
    });

    if (existingReceivedRequest) {
      return res.status(400).json({
        message:
          "This user has already sent you a friend request. Please accept or reject it instead.",
        requestId: existingReceivedRequest._id,
      });
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

const acceptFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  try {
    const friend = await Friend.findOne({
      userId: friendId,
      friendId: req.user._id,
      status: "pending",
    });
    if (!friend) {
      return res.status(400).json({ message: "Friend request not found" });
    }
    friend.status = "accepted";
    await friend.save();
    res.status(200).json(friend);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  try {
    const friend = await Friend.findOne({
      userId: friendId,
      friendId: req.user._id,
      status: "pending",
    });
    if (!friend) {
      return res.status(400).json({ message: "Friend request not found" });
    }
    await Friend.deleteOne({ _id: friend._id });
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const cancelFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  try {
    const friend = await Friend.findOne({
      userId: req.user._id,
      friendId,
      status: "pending",
    });
    if (!friend) {
      return res.status(400).json({ message: "Friend request not found" });
    }
    friend.status = "canceled";
    friend.canceledAt = new Date();
    await friend.save();
    res.status(200).json({
      message:
        "Friend request cancelled. You can send a new request to this user after 7 days.",
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await Friend.find({
      friendId: req.user._id,
      status: "pending",
    }).populate("userId", "username");
    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const getFriendRequestsCount = async (req, res) => {
  try {
    const friendRequestsCount = await Friend.countDocuments({
      friendId: req.user._id,
      status: "pending",
    });
    res.status(200).json({ count: friendRequestsCount });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const getSentFriendRequestsCount = async (req, res) => {
  try {
    const friendRequestsCount = await Friend.countDocuments({
      userId: req.user._id,
      status: "pending",
    });
    res.status(200).json({ count: friendRequestsCount });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const unFriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const friend = await Friend.findOne({
      $or: [
        { userId: req.user._id, friendId: friendId },
        { userId: friendId, friendId: req.user._id },
      ],
    });
    if (!friend) {
      return res.status(400).json({ message: "Friend not found" });
    }
    await Friend.deleteOne({ _id: friend._id });
    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const cleanupExpiredCanceledRequests = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await Friend.deleteMany({
      status: "canceled",
      canceledAt: { $lt: sevenDaysAgo },
    });

    console.log("Cleaned up expired canceled friend requests");
  } catch (error) {
    console.error("Error cleaning up canceled friend requests:", error);
  }
};

module.exports = {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  getFriendRequestsCount,
  getSentFriendRequestsCount,
  unFriend,
  cleanupExpiredCanceledRequests,
};
