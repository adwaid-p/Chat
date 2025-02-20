const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)

const PORT = process.env.PORT || 3001
const connectToDb = require('./db/db')
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser');
const userModel = require('./models/user.model');
const MessageModel = require('./models/message.model');

connectToDb()

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', userRoutes)

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


io.on('connection',(socket)=>{
    // console.log('A user is connected: ',socket.id);
    socket.on('join', async (userId) => {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true } // Return the updated document
        );
        console.log('Updated socketId:', user.socketId);
    });
    socket.on('privateMessage',async({senderId,receiverId,message})=>{
        // console.log(message)
        // console.log('the userId is ',senderId)
        // console.log('the receiverId is ',receiverId)
        const receiver = await userModel.findById(receiverId)
        if(!receiver || !receiver.socketId){
            console.log('Receiver not found or offline',receiverId)
        }
        // console.log('The receiver is socket id is ',receiver.socketId)
        // io.emit('receiveMessage',message)
        io.to(receiver.socketId).emit('receiveMessage',{senderId,message})
        const newMessage = await MessageModel.create({senderId,receiverId,message})
        console.log(newMessage)
        // io.to(receiver.socketId).emit('receiveMessage',message)
    })
    socket.on('IncoMessage',async({senderId,receiverId,message})=>{
        const receiver = await userModel.findById(receiverId)
        if(!receiver || !receiver.socketId){
            console.log('Receiver not found or offline',receiverId)
        }
        io.to(receiver.socketId).emit('receiveMessage',{senderId,message})
    })
})