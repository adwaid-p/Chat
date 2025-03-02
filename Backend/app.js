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
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.model");
const MessageModel = require("./models/message.model");

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
      console.log("user data at time of online", user);
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
      async ({ senderId, receiverId, message, createdAt }) => {
        // console.log(message)
        // console.log('the userId is ',senderId)
        // console.log('the receiverId is ',receiverId)
        const receiver = await userModel.findById(receiverId);
        const newMessage = await MessageModel.create({
          senderId,
          receiverId,
          message,
        });
        if (!receiver || !receiver.socketId) {
          console.log("Receiver not found or offline", receiverId);
        }
        // console.log('The receiver is socket id is ',receiver.socketId)
        // io.emit('receiveMessage',message)
        io.to(receiver.socketId).emit("receiveMessage", {
          senderId,
          message,
          createdAt,
        });
        // const newMessage = await MessageModel.create({senderId,receiverId,message})
        console.log(newMessage);
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
        io.to(receiver.socketId).emit("receiveMessage", {
          senderId,
          message,
          createdAt,
        });
      }
    );
  } catch (error) {
    console.log("The error is ", error.message);
  }
});
