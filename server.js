const express = require('express');
const app = express();
const cors = require('cors');
// We do this because the front end runs on 3000
const PORT = process.env.PORT || 3001;
// heroku gives a port that the app runs on so we set it equal to the environments process to ensure it deploys correctly

// in package.json change the main to the server and add the nodemon script
app.use(express.json());
const models = require('./models');
const user = require('./models/user')
require ('dotenv').config();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    })
);

// routers
const usersRouter = require('./routes/Users.js');
app.use('/register', usersRouter)


app.listen(PORT, () => {
    console.log(`app started on ${PORT}`)
});