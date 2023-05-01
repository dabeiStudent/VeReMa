import connection from "../config/connect2MySQL";
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
//Xu li cac trang hien thi
let getHome = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        return res.render('index.ejs', { token: token, name: rs.name, role: rs.role });
    } else {
        return res.render('index.ejs', { token: null, role: null, name: null })
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
                    return res.render('about.ejs', { token: null, role: null, name: null });
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
                return res.render('about.ejs', { token: null, dataUser: dataUser, role: null });
            }
        );
    }
}
let getContact = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        return res.render('contact.ejs', { token: token, name: rs.name, role: rs.role, message: null });
    } else {
        return res.render('contact.ejs', { token: token, role: null, name: null, message: null })
    }
}
let postContact = async (req, res) => {
    var token = req.cookies["token"];
    const ten = req.body.ten;
    const email = req.body.email;
    const sdt = req.body.sdt;
    const mess = req.body.mess;
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query('Insert into lien_lac (ten_tk, ten, email, sdt, noi_dung) values (?,?,?,?,?)', [rs.name, ten, email, sdt, mess],
            function (err, results) {
                return res.render('contact.ejs', { token: token, name: rs.name, role: rs.role, message: 'Sent' });
            })
    } else {
        connection.query('Insert into lien_lac (ten_tk, ten, email, sdt, noi_dung) values (?,?,?,?,?)', [null, ten, email, sdt, mess],
            function (err, results) {
                return res.render('contact.ejs', { token: null, name: null, role: null, message: 'Sent' });
            })
    }
}
let getFurni = async (req, res) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        return res.render('furnitures.ejs', { token: token, name: rs.name, role: rs.role });
    } else {
        return res.render('furnitures.ejs', { token: null, role: null, name: null })
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
                return res.render('manager.ejs', { token: token, name: rs.name, role: rs.role, dataUser: dataUser });
                //console.log(dataUser)
            }
        )
    } else {
        return res.send('AI CHO XEM');
    }
}

let getVproduct = async (req, res) => {
    var token = req.cookies["token"];
    const all = [];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query(
            'Select ten_tk, quyen from ds_tai_khoan where ma_tk = ?', [rs.id],
            function (err, results, fields) {
                if (results) {
                    var name = results[0].ten_tk;
                    var role = results[0].quyen;
                    connection.query('Select * from ds_phu_tung', function (err, results, fields) {
                        if (results) {
                            for (let i = 0; i < results.length; i++) {
                                all[i] = results[i];
                            }
                            return res.render('vproducts.ejs', { token: token, name: name, role: role, detailProduct: all });
                        }
                    })
                } else {
                    return res.send(err);
                }
            }
        )
    } else {
        connection.query('Select * from ds_phu_tung', function (err, results, fields) {
            if (results) {
                for (let i = 0; i < results.length; i++) {
                    all[i] = results[i];
                }
                return res.render('vproducts.ejs', { token: null, name: null, role: null, detailProduct: all });
            }
        })
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Xu li cac van de ve tai khoan...
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
                        var detailUser = results
                        connection.query('Select image from ds_tai_khoan where ten_tk = ?', [rs.name],
                            function (err, results) {
                                return res.render('detail.ejs', { detailUser: detailUser, img: results, role: role });
                            })
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
                        var detailUser = results
                        connection.query('Select image from ds_tai_khoan where ten_tk = ?', [rs.name],
                            function (err, results) {
                                return res.render('detail.ejs', { detailUser: detailUser, img: results, role: role });
                            })
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
let uploadImg = async (req, res) => {
    var img = req.file.filename;
    var tenTk = req.body.tenTk;
    connection.query(`update ds_tai_khoan set image = "/images/${img}" where ten_tk= "${tenTk}"`,
        function (err, results) {
            if (results) {
                return res.redirect('/yourprofile.ejs');
            }
            else {
                return res.send(err);
            }
        })
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
                    let detailUser = results;
                    connection.query(`Select image from ds_tai_khoan where ten_tk = ${name}`,
                        function (err, results, fields) {
                            return res.render('profile.ejs', { detailUser: detailUser, img: results, type: "admin" });
                        })
                    //return res.render('profile.ejs', { detailUser: results, type: "admin" });
                }
                else {
                    connection.query(
                        `SELECT * FROM khach_hang WHERE ten_tk=  ${name}`,
                        function (err, results, fields) {
                            if (results) {
                                let detailUser = results;
                                connection.query(`Select image from ds_tai_khoan where ten_tk = ${name}`,
                                    function (err, results, fields) {
                                        return res.render('profile.ejs', { detailUser: detailUser, img: results, type: "kh" });
                                    })
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
    if (token) {
        const rs = jwt.verify(token, 'mk');
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
                            return res.render('manager.ejs', { token: token, name: rs.name, role: rs.role, dataUser: dataUser });
                            //console.log(dataUser)
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
                            return res.render('manager.ejs', { token: token, name: rs.name, role: rs.role, dataUser: dataUser });
                            //console.log(dataUser)
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Xử lí các vấn đề về dịch vụ
let getAddprod = async (req, res, next) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role != "admin") {
            return res.redirect('/');
        }
        return res.render('addprod.ejs', { token: token, name: rs.name, role: rs.role, message: null });
    } else {
        return res.redirect('/');
    }
}
let postAddprod = async (req, res, next) => {
    const ten = req.body.tenPt;
    const gia = req.body.donGia;
    const sl = req.body.soLuong;
    const img = req.file.filename;
    const uimg = `/images/${img}`;
    const mt = req.body.mieuTa;
    connection.query('Insert into ds_phu_tung (ten_pt,don_gia,so_luong,image,description) values (?,?,?,?,?)', [ten, gia, sl, uimg, mt],
        function (err, results, fields) {
            if (results) {
                return res.render('addprod.ejs', { message: 'Thanh Cong', role: 'admin' });
            } else {
                return res.render('addprod.ejs', { mess: 'Loi', role: 'admin' });
            }
        })
}
let getUpdateprod = async (req, res, next) => {
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role != "admin") {
            return res.redirect('/');
        }
        return res.render('updateprod.ejs', { token: token, name: rs.name, role: rs.role, mess: null, ten: null, gia: null, sl: null, des: null });
    } else {
        return res.redirect('/');
    }
}
let getUpdateOneProd = async (req, res, next) => {
    const ten = req.params.ten;
    const gia = req.params.gia;
    const sl = req.params.sl;
    const des = req.params.des;
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role != "admin") {
            return res.redirect('/');
        }
        return res.render('updateprod.ejs', { token: token, name: rs.name, role: rs.role, mess: null, ten: ten, gia: gia, sl: sl, des: des });
    } else {
        return res.redirect('/');
    }
}
let postUpdateprod = async (req, res, next) => {
    const ten = req.body.tenPt;
    const gia = req.body.donGia;
    const sl = req.body.soLuong;
    const img = req.file.filename;
    const uimg = `/images/${img}`;
    const mt = req.body.mieuTa;
    connection.query('Update ds_phu_tung set don_gia =?, so_luong =?, image= ?, description =? where ten_pt=?', [gia, sl, uimg, mt, ten],
        function (err, results, fields) {
            if (results) {
                return res.render('updateprod.ejs', { mess: 'Thanh Cong', role: 'admin', ten: null, gia: null, sl: null, des: null });
            } else {
                return res.render('updateprod.ejs', { mess: 'Loi', role: 'admin', ten: null, gia: null, sl: null, des: null });
            }
        })
}


let chatApp = async (req, res, next) => {
    return res.render('chat.ejs');
}

module.exports = {
    getHome, getAbout, getContact, postContact, getFurni, getMana, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile, chatApp, updateProfile, postUpdate, uploadImg,
    getVproduct, getAddprod, postAddprod, getUpdateprod, postUpdateprod, getUpdateOneProd
}