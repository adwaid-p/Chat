const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const groupMessageRoutes = require("./routes/group.routes");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.model");
const MessageModel = require("./models/message.model");
const { group } = require("console");
const upload = require("./middlewares/multer.middlewares");
const cloudinary = require("./utils/Cloudinary");

connectToDb();

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRoutes);

app.use("/ai", aiRoutes);

app.use("/groupMessage", groupMessageRoutes);

app.post("/upload-image", upload.single("image"), async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    return res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
  try {
    // console.log('A user is connected: ',socket.id);
    socket.on("join", async (userId) => {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { socketId: socket.id, isOnline: true, lastSeen: Date.now() },
        { new: true } // Return the updated document
      );
      // console.log("user data at time of online", user);
      if (user) {
        io.emit("Status", `${user.userName} is online`);
        io.emit("userStatus", {
          userId: user._id,
          isOnline: true,
          lastSeen: user.lastSeen,
        });
      }
      // console.log('Updated socketId:', user.socketId);

      // const onlineUsers = await userModel.find({ isOnline: true }, '_id');
      // socket.emit('initialStatus', onlineUsers.map(user => ({
      //   userId: user._id,
      //   isOnline: true
      // })));
    });

    socket.on("disconnect", async () => {
      try {
        const user = await userModel.findOneAndUpdate(
          { socketId: socket.id },
          {
            isOnline: false,
            lastSeen: Date.now(),
            socketId: null,
          },
          { new: true }
        );

        console.log("User disconnected:");
        //   console.log('user data at the time of offline', user);

        if (user) {
          io.emit("userStatus", {
            userId: user._id,
            isOnline: false,
            lastSeen: user.lastSeen,
          });
        }
        io.emit("Status", `${user.userName} is offline`);
      } catch (error) {
        console.log("Error in disconnect handler:", error.message);
      }
    });

    socket.on(
      "privateMessage",
      async ({ senderId, receiverId, message, image, createdAt }) => {
        // console.log(message)
        // console.log('the userId is ',senderId)
        // console.log('the receiverId is ',receiverId)
        const receiver = await userModel.findById(receiverId);
        const newMessage = await MessageModel.create({
          senderId,
          receiverId,
          message,
          image,
        });
        if (!receiver || !receiver.socketId) {
          // console.log("Receiver not found or offline", receiverId);
        }
        // console.log('The receiver is socket id is ',receiver.socketId)
        // io.emit('receiveMessage',message)
        // io.to(receiver.socketId).emit("receiveMessage", {
        io.emit("receiveMessage", {
          senderId,
          receiverId,
          message,
          image,
          createdAt,
        });
        // const newMessage = await MessageModel.create({senderId,receiverId,message})
        //console.log(newMessage);
        // io.to(receiver.socketId).emit('receiveMessage',message)
      }
    );
    socket.on(
      "IncoMessage",
      async ({ senderId, receiverId, message, createdAt }) => {
        const receiver = await userModel.findById(receiverId);
        if (!receiver || !receiver.socketId) {
          console.log("Receiver not found or offline", receiverId);
        }
        console.log("the inco message is:", receiver.socketId);
        io.to(receiver.socketId).emit("receiveMessage", {
          senderId,
          message,
          createdAt,
        });
      }
    );
    socket.on(
      "groupMessage",
      async ({ senderId, groupId, message, image,createdAt }) => {
        const newMessage = await MessageModel.create({
          senderId,
          groupId,
          message,
          image,
        });
        io.to(groupId).emit("groupMessage", {
          _id: newMessage._id,
          senderId,
          groupId,
          message,
          image,
          createdAt: newMessage.createdAt,
        });
      }
    );
    socket.on(
      "IncoGroupMessage",
      async ({ senderId, groupId, message, createdAt }) => {
        // const receiver = await userModel.findById(receiverId);
        // if (!receiver || !receiver.socketId) {
        //   console.log("Receiver not found or offline", receiverId);
        // }
        // console.log('the inco message is:', receiver.socketId);
        io.to(groupId).emit("groupMessage", {
          senderId,
          message,
          createdAt,
        });
      }
    );
    socket.on("joinGroup", (groupId) => {
      // console.log(`user joined group : ${groupId}`);
      socket.join(groupId);
    });
    // socket.on("typing", async ({ senderId, receiverId, groupId }) => {
    //   try {
    //     if (groupId) {
    //       io.to(groupId).emit("typing", { senderId });
    //     } else if(receiverId){
    //       const receiver = await userModel.findById(receiverId);
    //       if (!receiver || !receiver.socketId) {
    //         console.log("Receiver not found or offline", receiverId);
    //         return;
    //       }
    //       // console.log('the inco message is:', receiver.socketId);
    //       io.to(receiver.socketId).emit("typing", {
    //         senderId,
    //         receiverId,
    //       });
    //     }
    //   } catch (error) {
    //     console.log("Error in Typing event:", error.message);
    //   }
    // });
  } catch (error) {
    console.log("The error is ", error.message);
  }
});
