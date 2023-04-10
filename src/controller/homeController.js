import connection from "../config/connect2MySQL";
const argon2 = require('argon2');
const jwt = require('jsonwebtoken')

//Trang chu
let getHome = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    return res.render('index.ejs', { token: token, name: name, role: role });
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.render('index.ejs', { token: null })
    }
}
let getAbout = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        let dataUser;
        connection.query(
            'SELECT * FROM nhan_vien',
            function (err, results, fields) {
                //console.log(results);
                //for mobile
                //return res.json(results)
                dataUser = results;
            }
        );
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    return res.render('about.ejs', { token: token, name: name, role: role, dataUser: dataUser });
                } else {
                    return res.send(err);
                }
            }
        )
    }
    else {
        let dataUser;
        connection.query(
            'SELECT * FROM nhan_vien',
            function (err, results, fields) {
                //console.log(results);
                //for mobile
                //return res.json(results)
                dataUser = results;
                return res.render('about.ejs', { token: null, dataUser: dataUser });
            }
        );
    }
}
let getContact = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    return res.render('contact.ejs', { token: token, name: name, role: role });
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.render('contact.ejs', { token: null })
    }
}
let getFurni = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    return res.render('furnitures.ejs', { token: token, name: name, role: role });
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.render('furnitures.ejs', { token: null })
    }
}
let getTesti = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    return res.render('testimonial.ejs', { token: token, name: name, role: role });
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.render('testimonial.ejs', { token: null })
    }
}
let accountProfile = async (req, res) => {
    var token = req.cookies["token"];
    if (token) {
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select * from nhan_vien where nhan_vien.id_account = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    return res.render('detail.ejs', { detailUser: results });
                }
                else {
                    return res.render('detail.ejs', { detailUser: null });
                }
            }
        )
    } else {
        return res.send('Da DN dau ma doi xem profile');
    }
}
let getProfile = async (req, res) => {
    const id = req.params.userid;
    connection.query(
        `SELECT * FROM nhan_vien WHERE ma_nv=  ${id}`,
        function (err, results, fields) {
            if (results) {
                return res.render('detail.ejs', { detailUser: results });
            }
            else {
                return res.send(err);
            }
        }
    )
}
let getSignup = async (req, res) => {
    connection.query(
        `SELECT * FROM ds_tai_khoan`,
        function (err, results, fields) {
            if (results) {
                //console.log(results);
                return res.render('signup.ejs', { allAccounts: results });
            }
            else {
                return res.send(err);
            }
        }
    )
}
let getSignin = async (req, res) => {
    connection.query(
        `SELECT * FROM ds_tai_khoan`,
        function (err, results, fields) {
            //console.log(results);
            return res.render('signin.ejs', { allAccounts: results, err: null });
        }
    )
}

let postSignup = async (req, res) => {
    console.log(req.body);
    const username = req.body.userName;
    const password = req.body.passWord;
    const repassword = req.body.repassWord;
    const hashpass = await argon2.hash(password);
    //console.log(hashpass);
    if (password == repassword) {
        connection.query(
            'Insert into ds_tai_khoan (ten_tk, mat_khau, image, quyen) values (?,?,?,?)', [username, hashpass, "", 'kh'],
            function (err, results, fields) {
                if (results) {
                    return res.redirect('/signin.ejs');
                }
                else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.send("Mật khẩu không khớp");
    }
}
/* xu li signup dien luon thong tin ca nhan cua user luon */
let postSignin = async (req, res, next) => {
    var username = req.body.userName;
    var password = req.body.passWord;
    if (!username || !password)
        return res.status(400).send({ success: false, message: 'Missing username or password' });
    try {
        connection.query(
            'Select ma_tk, ten_tk, mat_khau from ds_tai_khoan where ten_tk = ?', [username],
            async function (err, results, fields) {
                if (results.length > 0) {
                    const validPassword = await argon2.verify(results[0].mat_khau, password);
                    if (validPassword) {
                        const token = jwt.sign({ id: results[0].ma_tk, name: results[0].ten_tk }, 'mk');
                        //check token co luu id tk chua
                        //const rs = jwt.verify(token, 'mk')
                        //console.log(rs.name, rs.id);
                        res.cookie("token", token, {
                            httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 15)
                        })
                        //return res.json("dn thanh cong")
                        return res.redirect('/index.ejs');
                    } else {
                        return res.render("signin.ejs", { err: "Password sai" });
                    }
                } else {
                    return res.render("signin.ejs", { err: "Tai khoan khong ton tai" });
                }
            }
        )
    } catch (err) {
        return res.render("signin.ejs", { err: "Loi server" });
    }
}
let postLogout = async (req, res, next) => {
    res.clearCookie("token");
    //res.end();
    //return res.re("log out thanh cong");
    return res.render('index.ejs', { token: null });
}
module.exports = {
    getHome, getAbout, getContact, getFurni, getTesti, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile
}