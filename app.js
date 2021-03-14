//init all dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//import database
const sequelize = require('./utils/DB')

//serve static files
app.use(express.static(path.join(__dirname, '/uploads/')));

//init all middlewares

app.use(cors());
app.use(express.json()) //Used to parse JSON bodies
app.use(express.urlencoded({extended:true})); //Parse URL-encoded bodies

//test api
app.get('/', (req, res) => {
    res.status(200).json('hello')
})
//default error page
app.use((req, res, next) => {
    res.status(404).json({ "res": "Sorry can't find that!" });
});

//connect Database
//listening for port
const port = process.env.PORT || 5500;
(async () => {
    await sequelize.sync({  force: false });
    //await sequelize.sync()
    app.listen(port, () =>
      console.log(`Server Running on the port ....${port}`)
    );
})()

