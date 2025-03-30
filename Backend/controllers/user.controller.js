const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const MessageModel = require("../models/message.model");
const blackListTokenModel = require("../models/BlackListToken.model");
const cloudinary = require("../utils/Cloudinary");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, email, password, language } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await userService.createUser({
      userName,
      email,
      password: hashedPassword,
      language: language
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token);

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};

module.exports.searchUser = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is needed" });
    }
    const users = await userModel
      .find({
        $or: [
          { userName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
      .select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Server error", error: error.message });
  }
};

module.exports.updateFriend = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    // console.log('the user and friend id are : ',userId,friendId)
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true, runValidators: true }
    );
    // console.log("After Update: ", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    await userModel.findByIdAndUpdate(
      friendId,
      { $addToSet: { friends: userId } },
      { new: true, runValidators: true }
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.findProfile = async (req, res, next) => {
  try {
    const { id } = req.query;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // console.log(id)
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.fetchMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await MessageModel.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
    // const messages = await MessageModel.find()
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.fetchLastMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.query;
    const lastSeenMessage = await MessageModel.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(1);
    // console.log('the last seen message is :',lastSeenMessage)
    if (!lastSeenMessage) {
      return res.status(200).json({ message: "No message found" });
    }
    res.status(200).json(lastSeenMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.updateProfilePic = async (req, res, next) => {
  const { userId } = req.body;
  console.log("the userId is :", userId);
  try {
    const response = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    console.log("response for image upload is :", response.secure_url);
    const user = await userModel.findByIdAndUpdate(
      userId,
      { profilePic: response.secure_url },
      { new: true }
    );
    console.log("the user after the image upload is :", user);
    return res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
