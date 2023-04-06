//Bien moi truong
require('dotenv').config();
//Khai bao express
const express = require('express');
const app = express();
const http = require('http');
import configViewengine from './config/viewengine.js';

app.use(express.static('public'));
configViewengine(app);
app.get('/', (req, res) => {
    res.render('index.ejs')
})

const PORT = process.env.PORT;
app.listen(PORT || 9000, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})
