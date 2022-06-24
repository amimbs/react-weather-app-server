const express = require('express');
const cors = require('cors');
const app = express();

// We do this because the front end runs on 3000
const PORT = process.env.PORT || 3001;
// heroku gives a port that the app runs on so we set it equal to the environments process to ensure it deploys correctly

app.use(
    cors()
);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// in package.json change the main to the server and add the nodemon script
app.use(express.json());
const models = require('./models');
const user = require('./models/user')
require ('dotenv').config();



// routers
const usersRouter = require('./routes/Users.js');
app.use('/users', usersRouter)


app.listen(PORT, () => {
    console.log(`app started on ${PORT}`)
});

