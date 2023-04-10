//Bien moi truong
require('dotenv').config();
//Khai bao express
const express = require('express');
const app = express();
const http = require('http');
const cookieParser = require('cookie-parser')
import configViewengine from './config/viewengine.js';
import initWebRoute from './route/web.js';
//connect2MYSQL
import connection from './config/connect2MySQL.js';

//Chay server
const PORT = process.env.PORT;
app.listen(PORT || 9000, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})
//Body-parser Lay du lieu tu body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Khai bao su dung cac file static 
app.use(express.static('public'));
//Thiet lap view
configViewengine(app);
//Cai dat duong dan cho web
initWebRoute(app);


