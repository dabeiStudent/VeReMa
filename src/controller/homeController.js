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
                    //console.log(role);
                    return res.render('index.ejs', { token: token, name: name, role: role });
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.render('index.ejs', { token: null, role: null })
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
let getMana = async (req, res) => {
    var token = req.cookies["token"];
    const rs = jwt.verify(token, 'mk');
    if (token != null && rs.role == "admin") {
        let dataUser;
        connection.query(
            'SELECT * FROM ds_tai_khoan',
            function (err, results, fields) {
                //console.log(results);
                //for mobile
                //return res.json(results)
                dataUser = results;
                //console.log(dataUser)
            }
        );
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    return res.render('manager.ejs', { token: token, name: name, role: role, dataUser: dataUser });
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        return res.send('AI CHO XEM');
    }
}
let accountProfile = async (req, res) => {
    var token = req.cookies["token"];
    if (token) {
        const rs = jwt.verify(token, 'mk');
        const role = rs.role;
        //console.log('role: ', role);
        if (role == "kh") {
            connection.query(
                'Select * from khach_hang where khach_hang.ten_tk = ?', [rs.name],
                function (err, results, fields) {
                    if (results) {
                        return res.render('detail.ejs', { detailUser: results, role: role });
                    }
                    else {
                        return res.render('detail.ejs', { detailUser: null });
                    }
                }
            )
        }
        if (role == "admin") {
            connection.query(
                'Select * from nhan_vien where nhan_vien.ten_tk = ?', [rs.name],
                function (err, results, fields) {
                    if (results) {
                        return res.render('detail.ejs', { detailUser: results, role: role });
                    }
                    else {
                        return res.render('detail.ejs', { detailUser: null });
                    }
                }
            )
        }
    } else {
        return res.send('Da DN dau ma doi xem profile');
    }
}
let getProfile = async (req, res) => {
    const name = req.params.username;
    var token = req.cookies["token"];
    const rs = jwt.verify(token, 'mk');
    if (rs.role == "admin") {
        connection.query(
            `SELECT * FROM nhan_vien WHERE ten_tk=  ${name}`,
            function (err, results, fields) {
                if (results.length > 0) {
                    console.log('admin')
                    console.log(results);
                    return res.render('profile.ejs', { detailUser: results, type: "admin" });
                }
                else {
                    connection.query(
                        `SELECT * FROM khach_hang WHERE ten_tk=  ${name}`,
                        function (err, results, fields) {
                            if (results) {
                                // console.log('kh')
                                // console.log(results);
                                return res.render('profile.ejs', { detailUser: results, type: "kh" });
                            }
                            else {
                                return res.send(err);
                            }
                        }
                    )
                }
            }
        )
    } else {
        return res.send('AI CHO XEM MA XEM');
    }
}
let updateProfile = async (req, res, next) => {
    var token = req.cookies["token"];
    var name = req.params.username;
    const rs = jwt.verify(token, 'mk');
    if (token) {
        connection.query(
            `SELECT * FROM nhan_vien WHERE ten_tk=  ${name}`,
            function (err, results, fields) {
                if (results.length > 0) {
                    return res.render('updateprofile.ejs', { detailUser: results, type: "nv" });
                }
                else {
                    connection.query(
                        `SELECT * FROM khach_hang WHERE ten_tk=  ${name}`,
                        function (err, results, fields) {
                            if (results) {
                                return res.render('updateprofile.ejs', { detailUser: results, type: "kh" });
                            }
                            else {
                                return res.send(err);
                            }
                        }
                    )
                }
            }
        )
    } else {
        return res.render('index.ejs', { token: null, role: null });
    }
}
let postUpdate = async (req, res) => {
    var token = req.cookies["token"];
    const rs = jwt.verify(token, 'mk');
    var makh = req.body.maKh;
    var tenkh = req.body.tenKh;
    var diachi = req.body.diaChi;
    var sdt = req.body.soDt;
    var luong = req.body.luong;
    var quyen = req.body.chucVu;
    var tentk = req.body.tenTk;
    if (quyen == "kh") {
        connection.query('UPDATE khach_hang SET ten_kh = ?, dia_chi = ?, sdt = ? WHERE ma_kh = ?', [tenkh, diachi, sdt, makh],
            function (err, results, fields) {
                if (results) {
                    let dataUser;
                    connection.query(
                        'SELECT * FROM ds_tai_khoan',
                        function (err, results, fields) {
                            //console.log(results);
                            //for mobile
                            //return res.json(results)
                            dataUser = results;
                            //console.log(dataUser)
                        }
                    );
                    connection.query(
                        'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
                        function (err, results, fields) {
                            if (results) {
                                var name = results[0].ten_tk;
                                var role = results[0].quyen;
                                return res.render('manager.ejs', { token: token, name: name, role: role, dataUser: dataUser });
                            } else {
                                return res.send(err);
                            }
                        }
                    )
                }
                else {
                    return res.send(err);
                }
            }
        )
    } else {
        connection.query('UPDATE nhan_vien SET ten_nv = ?, dia_chi = ?, sdt = ?, luong = ? WHERE ma_nv = ?', [tenkh, diachi, sdt, luong, makh],
            function (err, results, fields) {
                if (results) {
                    let dataUser;
                    connection.query(
                        'SELECT * FROM ds_tai_khoan',
                        function (err, results, fields) {
                            //console.log(results);
                            //for mobile
                            //return res.json(results)
                            dataUser = results;
                            //console.log(dataUser)
                        }
                    );
                    connection.query(
                        'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
                        function (err, results, fields) {
                            if (results) {
                                var name = results[0].ten_tk;
                                var role = results[0].quyen;
                                return res.render('manager.ejs', { token: token, name: name, role: role, dataUser: dataUser });
                            } else {
                                return res.send(err);
                            }
                        }
                    )
                }
                else {
                    return res.send(err);
                }
            }
        )
    }
}
let getSignup = async (req, res) => {
    connection.query(
        `SELECT * FROM ds_tai_khoan`,
        function (err, results, fields) {
            //console.log(results);
            return res.render('signup.ejs', { allAccounts: results, err: null });
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
    const fullname = req.body.fullName;
    const address = req.body.adDress;
    const phonenumber = req.body.phoneNumber;
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
                    connection.query(
                        'Insert into khach_hang (ten_kh,dia_chi,sdt, ten_tk) values(?,?,?,?)', [fullname, address, phonenumber, username],
                        function (err, results, fields) {
                            if (results) {
                                return res.redirect('/signin.ejs');
                            } else {
                                return res.render("signup.ejs", { err: "Tai khoan da ton tai 21" });
                            }
                        }
                    )
                }
                else {
                    return res.render('signup.ejs', { err: 'Ten dang nhap da ton tai' });
                }
            }
        )

    } else {
        return res.render("signup.ejs", { err: "Mat khau khong khop" });
    }
}

let postSignin = async (req, res, next) => {
    var username = req.body.userName;
    var password = req.body.passWord;
    if (!username || !password)
        return res.render("signin.ejs", { err: "Thieu username/password" });
    try {
        connection.query(
            'Select ma_tk, ten_tk,mat_khau, quyen from ds_tai_khoan where ten_tk = ?', [username],
            async function (err, results, fields) {
                if (results.length > 0) {
                    const validPassword = await argon2.verify(results[0].mat_khau, password);
                    if (validPassword) {
                        const token = jwt.sign({ id: results[0].ma_tk, name: results[0].ten_tk, role: results[0].quyen }, 'mk');
                        //check token co luu id tk chua
                        const rs = jwt.verify(token, 'mk')
                        console.log(rs.name, rs.id, rs.role);
                        res.cookie("token", token, {
                            httpOnly: true, expires: new Date(Date.now() + 1000 * 3600)
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
    return res.render('index.ejs', { token: null, role: null });
}
let chatApp = async (req, res, next) => {
    return res.render('chat.ejs');
}

module.exports = {
    getHome, getAbout, getContact, getFurni, getMana, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile, chatApp, updateProfile, postUpdate
}