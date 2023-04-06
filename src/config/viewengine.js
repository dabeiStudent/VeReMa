//Xu ly doc file ejs
const express = require('express');

const configViewengine = (app) => {
    app.use(express.static('./src/public'));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

export default configViewengine;
//package-json: type:commonjs