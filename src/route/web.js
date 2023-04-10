const express = require('express');
const cookieParser = require('cookie-parser');
import { getHome, getAbout, getContact, getFurni, getTesti, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile } from '../controller/homeController';
let router = express.Router();
router.use(cookieParser());
const initWebRoute = (app) => {
    router.get('/', getHome);
    router.get('/index.ejs', getHome);
    router.get('/about.ejs', getAbout);
    router.get('/contact.ejs', getContact);
    router.get('/furnitures.ejs', getFurni);
    router.get('/testimonial.ejs', getTesti);
    router.get('/detail/user/:userid', getProfile);
    router.get('/signup.ejs', getSignup);
    router.get('/signin.ejs', getSignin);
    router.get('/logout.ejs', postLogout);
    router.post('/signup.ejs', postSignup);
    router.post('/signin.ejs', postSignin);
    router.get('/profile.ejs', accountProfile);
    return app.use('/', router);
}

module.exports = initWebRoute;