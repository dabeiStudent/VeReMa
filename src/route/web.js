const express = require('express');
const cookieParser = require('cookie-parser');
//upload anh
const multer = require('multer');
const upload = multer({ dest: './src/public/images/' });
import {
    getHome, getAbout, getContact, postContact, getFurni, getMana, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile, chatApp, updateProfile, postUpdate, uploadImg,
    getVproduct, getAddprod, postAddprod, getUpdateprod, postUpdateprod, getUpdateOneProd, getCateprod
} from '../controller/homeController';
let router = express.Router();
router.use(cookieParser());
const initWebRoute = (app) => {
    router.get('/', getHome);
    router.get('/index.ejs', getHome);
    router.get('/about.ejs', getAbout);
    router.get('/contact.ejs', getContact);
    router.post('/contact.ejs', postContact);
    router.get('/furnitures.ejs', getFurni);
    router.get('/manager.ejs', getMana);
    router.get('/vproducts.ejs/:page', getVproduct);
    router.get('/vproducts.ejs/:catename/:page', getCateprod);
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
    router.get('/addprod.ejs', getAddprod);
    router.post('/addprod.ejs', upload.single('img'), postAddprod);
    router.get('/updateprod.ejs', getUpdateprod);
    router.get('/updateprod.ejs/:ten/:gia/:sl/:des', getUpdateOneProd);
    router.post('/updateprod.ejs', upload.single('img'), postUpdateprod);
    router.get('/chat.ejs', chatApp);
    return app.use('/', router);
}

module.exports = initWebRoute;