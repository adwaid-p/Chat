const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001
const connectToDb = require('./db/db')
const userRoutes = require('./routes/user.routes')

connectToDb()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})