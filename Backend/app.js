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
    socket.on('join',async (userId)=>{
        // console.log('the userId is ',userId)
        const user = await userModel.findByIdAndUpdate(userId,{socketId: socket.id})
        console.log(user.socketId)
    })
    socket.on('privateMessage',async({senderId,receiverId,message})=>{
        console.log(message)
        console.log('the userId is ',senderId)
        const receiver = await userModel.findById(receiverId)
        // console.log('The receiver is socket id is ',receiver.socketId)
        io.emit('receiveMessage',message)
        // io.to(receiver.socketId).emit('receiveMessage',{senderId,message})
    })
})