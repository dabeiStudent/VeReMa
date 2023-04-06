const express = require('express');
import { getHome } from '../controller/homeController';
let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', getHome);

    return app.use('/', router);
}

module.exports = initWebRoute;