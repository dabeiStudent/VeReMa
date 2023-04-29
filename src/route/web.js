const express = require('express');
const cookieParser = require('cookie-parser');
//upload anh
const multer = require('multer');
const upload = multer({ dest: './src/public/images/' });
import {
    getHome, getAbout, getContact, getFurni, getMana, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile, chatApp, updateProfile, postUpdate, uploadImg,
    getVproduct
} from '../controller/homeController';
let router = express.Router();
router.use(cookieParser());
const initWebRoute = (app) => {
    router.get('/', getHome);
    router.get('/index.ejs', getHome);
    router.get('/about.ejs', getAbout);
    router.get('/contact.ejs', getContact);
    router.get('/furnitures.ejs', getFurni);
    router.get('/manager.ejs', getMana);
    router.get('/vproducts.ejs', getVproduct);
    router.get('/detail/user/:username', getProfile);
    router.get('/update/user/:username', updateProfile);
    router.post('/update.ejs', postUpdate);
    router.post('/upload.ejs', upload.single('img'), uploadImg);
    router.get('/signup.ejs', getSignup);
    router.get('/signin.ejs', getSignin);
    router.get('/logout.ejs', postLogout);
    router.post('/signup.ejs', postSignup);
    router.post('/signin.ejs', postSignin);
    router.get('/yourprofile.ejs', accountProfile);
    router.get('/chat.ejs', chatApp);
    return app.use('/', router);
}

module.exports = initWebRoute;