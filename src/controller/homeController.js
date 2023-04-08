import connection from "../config/connect2MySQL";

//Trang chu
let getHome = async (req, res) => {
    return res.render('index.ejs');
}
let getAbout = async (req, res) => {
    connection.query(
        'SELECT * FROM nhan_vien',
        function (err, results, fields) {
            //console.log(results);
            //for mobile
            //return res.json(results)
            return res.render('about.ejs', { dataUser: results });
        }
    );
}
let getContact = async (req, res) => {
    return res.render('contact.ejs');
}
let getFurni = async (req, res) => {
    return res.render('furnitures.ejs');
}
let getTesti = async (req, res) => {
    return res.render('testimonial.ejs');
}
let getProfile = async (req, res) => {
    const id = req.params.userid;
    connection.query(
        `SELECT * FROM nhan_vien WHERE ma_nv=  ${id}`,
        function (err, results, fields) {
            console.log(results);
            return res.render('detail.ejs', { detailUser: results });
        }
    )
}
let getSignup = async (req, res) => {
    connection.query(
        `SELECT * FROM ds_tai_khoan`,
        function (err, results, fields) {
            console.log(results);
            return res.render('signup.ejs', { allAccounts: results });
        }
    )
}
let postSignup = async (req, res) => {
    console.log(req.body);
    const username = req.body.userName;
    const password = req.body.passWord;
    connection.query(
        'Insert into ds_tai_khoan (ten_tk, mat_khau, image, quyen) values (?,?,?,?)', [username, password, "", 'admin'],
        function (err, results, fields) {
            if (results) {
                return res.redirect('/signup.ejs');
            }
            else {
                return res.send(err);
            }
        }
    )

}
module.exports = {
    getHome, getAbout, getContact, getFurni, getTesti, getProfile, getSignup, postSignup
}