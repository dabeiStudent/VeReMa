const express = require('express');
const cookieParser = require('cookie-parser');
//upload anh
const multer = require('multer');
const upload = multer({ dest: './src/public/images/' });
import {
    getHome, getAbout, getContact, postContact, getFurni, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile, chatApp, updateProfile, postUpdate, uploadImg,
    getVproduct, getAddprod, postAddprod, getUpdateprod, postUpdateprod, getUpdateOneProd, getCateprod, getDelprod, postDelprod, getConfirmdel, postConfirmdel, getStaffcreate, postStaffcreate,
    getRepair, deleteAccount, postDeleteaccount, postDeletemess, getManage, postOrder, postOrder2, getDetailorder, getStaff, getUpdateorder, postUpdateorder, finishOrderpc
} from '../controller/homeController';

//Mobile:
import {
    signInmb, getAccountmb, getStaffmb, getCusmb, getProdmb, findCusmb, findStaffmb, editStaffProfile, editCustomerProfile, newOrder, allOrder, getOrderbystaff, finishOrder
} from '../controller/androidController';

let router = express.Router();
router.use(cookieParser());
const initWebRoute = (app) => {
    router.get('/', getHome);
    router.get('/index.ejs', getHome);
    router.get('/about.ejs', getAbout);
    router.get('/contact.ejs', getContact);
    router.post('/contact.ejs', postContact);
    router.get('/furnitures.ejs', getFurni);
    router.get('/management.ejs', getManage);
    router.post('/management.ejs', upload.single('img'), postOrder);
    router.post('/management2.ejs', upload.single('img'), postOrder2);
    router.post('/deletemess.ejs/:idmess', postDeletemess);
    router.get('/vproducts.ejs/:page', getVproduct);
    router.get('/vproducts.ejs/:catename/:page', getCateprod);
    router.get('/repair.ejs', getRepair);
    router.get('/detail/user/:username', getProfile);
    router.get('/delete/user/:username/:role', deleteAccount);
    router.post('/delete/user/:username/:role', postDeleteaccount);
    router.get('/update/user/:username', updateProfile);
    router.post('/update.ejs', postUpdate);
    router.post('/upload.ejs', upload.single('img'), uploadImg);
    router.get('/signup.ejs', getSignup);
    router.get('/signin.ejs', getSignin);
    router.get('/logout.ejs', postLogout);
    router.post('/signup.ejs', postSignup);
    router.post('/signin.ejs', postSignin);
    router.get('/createstaff.ejs', getStaffcreate);
    router.post('/createstaff.ejs', upload.single('img'), postStaffcreate);
    router.get('/yourprofile.ejs', accountProfile);
    router.get('/addprod.ejs', getAddprod);
    router.post('/addprod.ejs', upload.single('img'), postAddprod);
    router.get('/updateprod.ejs', getUpdateprod);
    router.get('/updateprod.ejs/:ten/:gia/:sl/:des', getUpdateOneProd);
    router.post('/updateprod.ejs', upload.single('img'), postUpdateprod);
    router.get('/deleteprod.ejs', getDelprod);
    router.post('/deleteprod.ejs', postDelprod);
    router.get('/confirmdelete.ejs/:ten', getConfirmdel);
    router.post('/confirmdelete.ejs/:ten', postConfirmdel);
    router.get('/detailorder/:id', getDetailorder);
    router.get('/getstaff/:id', getStaff);
    router.get('/updateorder/:id', getUpdateorder);
    router.post('/updateorder/:id', postUpdateorder);
    router.post('/finishorder/:id', finishOrderpc);
    router.get('/chat.ejs', chatApp);
    return app.use('/', router);
}


//android
const androidRouter = (app) => {
    router.post('/signinmb', signInmb);
    router.get('/getallaccmb', getAccountmb);
    router.get('/getallcusmb', getCusmb);
    router.get('/getallstaffmb', getStaffmb);
    router.get('/getallprodmb', getProdmb);
    router.get('/getallordermb', allOrder);
    router.post('/findcusmb', findCusmb);
    router.post('/findstaffmb', findStaffmb);
    router.post('/updateprofilestaff', editStaffProfile);
    router.post('/updateprofilecustomer', editCustomerProfile);
    router.post('/addneworder', newOrder);
    router.post('/getorderbystaff', getOrderbystaff);
    router.post('/finishorder', finishOrder);
    return app.use('/', router);
}
module.exports = { initWebRoute, androidRouter };