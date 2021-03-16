//init all dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('dotenv').config();
const path = require('path');

const app = express();

//import database
const sequelize = require('./utils/DB')

//serve static files
//app.use(express.static(path.join(__dirname, '/uploads/')));

//init all middlewares

app.use(cors());
app.use(express.json()) //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies


//config all routes
//app.use('/api/v1/admin', require('./routes/Admin'));
app.use('/api/v1/user', require('./routes/User'));
//app.use('/api/v1/public', require('./routes/Public'));

//test api
// app.get('/', (req, res) => {
//     res.status(200).json('hello')
// })

//default error page
app.use((req, res, next) => {
    res.status(404).json({ "res": "Sorry can't find Route!" });
});


//listening for port
const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server running on port: ${port}`));


