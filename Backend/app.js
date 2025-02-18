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
const cookieParser = require('cookie-parser')

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
    console.log('A user is connected: ',socket.id);
    socket.on('sendMessage',(message)=>{
        console.log(message)
        io.emit('receiveMessage',message)
    })
})