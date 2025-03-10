const groupMessageModel = require("../models/groupMessage.model");
const messageModel = require("../models/message.model");

module.exports.createGroup = async (req, res, next) => {
  try {
    const { name, members, createdBy } = req.body;

    if (!name || !members || !createdBy) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newGroup = await groupMessageModel.create({
      name,
      members,
      createdBy,
    });
    return res.status(201).json(newGroup);
  } catch (error) {
    console.log("Error in creating group is : ", error.message);
    return res.status(400).json({ message: "Server error" });
  }
};

module.exports.getGroups = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const groups = await groupMessageModel.find({ members: userId });
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(400).json({ message: "Server error" });
  }
};

module.exports.fetchGroupMessage = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const messages = await messageModel.find({ groupId: groupId }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error while fetching group messages ", error);
    return res.status(500).json({ message: error.message });
  }
};
