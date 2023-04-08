const express = require('express');
import { getHome, getAbout, getContact, getFurni, getTesti, getProfile, getSignup, postSignup } from '../controller/homeController';
let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', getHome);
    router.get('/index.ejs', getHome);
    router.get('/about.ejs', getAbout);
    router.get('/contact.ejs', getContact);
    router.get('/furnitures.ejs', getFurni);
    router.get('/testimonial.ejs', getTesti);
    router.get('/detail/user/:userid', getProfile);
    router.get('/signup.ejs', getSignup);
    router.post('/signup.ejs', postSignup);
    return app.use('/', router);
}

module.exports = initWebRoute;