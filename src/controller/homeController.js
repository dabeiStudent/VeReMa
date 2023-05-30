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
        const rs = jwt.verify(token, 'mk');
        return res.render('about.ejs', { token: token, name: rs.name, role: rs.role });
    } else {
        return res.render('about.ejs', { token: null, name: null, role: null });
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
let getManage = async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        const rs = jwt.verify(token, "mk");
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const today = `${year}-${month + 1}-${day}`;
        connection.query('Select * from ds_tai_khoan where ten_tk="admin"', function (err, results) {
            if (results) {
                const admin = results; //admin
                connection.query('Select * from ds_tai_khoan', function (err, results, fields) {
                    if (results) {
                        const accounts = results;
                        connection.query('Select * from nhan_vien where ten_tk != "admin"', function (err, results, fields) {
                            if (results) {
                                const staff = results;
                                connection.query('Select * from ds_phu_tung', function (err, results) {
                                    if (results) {
                                        const pt = results;
                                        connection.query('Select * from lien_lac', function (err, results) {
                                            if (results) {
                                                const ll = results;
                                                connection.query('Select * from khach_hang', function (err, results) {
                                                    if (results) {
                                                        const kh = results;
                                                        connection.query('Select * from nhan_vien where ma_nv != "admin"', function (err, results) {
                                                            if (results) {
                                                                const nv = results;
                                                                return res.render('management.ejs', { admin: admin, accounts: accounts, today: today, staff: staff, pt: pt, ll: ll, kh: kh, nv: nv });
                                                            } else {
                                                                return res.render('management.ejs', { admin: admin, accounts: accounts, today: today, staff: staff, pt: pt, ll: ll, kh: kh, nv: null });
                                                            }
                                                        })

                                                    }
                                                    else {
                                                        return res.render('management.ejs', { admin: admin, accounts: accounts, today: today, staff: staff, pt: pt, ll: ll, kh: null, nv: null });
                                                    }
                                                })
                                            } else {
                                                return res.render('management.ejs', { admin: admin, accounts: accounts, today: today, staff: staff, pt: pt, ll: null, kh: null, nv: null });
                                            }
                                        })
                                    } else {
                                        return res.render('management.ejs', { admin: admin, accounts: accounts, today: today, staff: staff, pt: null, ll: null, kh: null, nv: null });
                                    }
                                })
                            } else {
                                return res.render('management.ejs', { admin: admin, accounts: accounts, today: today, staff: null, pt: null, ll: null, kh: null, nv: null });
                            }
                        })
                    } else {
                        return res.render('management.ejs', { admin: admin, accounts: null, today: today, staff: null, pt: null, ll: null, kh: null, nv: null });
                    }
                })
            }
        })
    } else {
        return res.redirect('index.ejs');
    }
}
let postOrder = async (req, res) => {
    const fullname = req.body.tenKh;
    const address = req.body.diaChi;
    const phonenumber = req.body.soDt;
    const username = req.body.tenTk;
    const password = req.body.matKhau;
    const vehiname = req.body.tenXe;
    const vehiid = req.body.soXe;
    const desc = req.body.moTa;
    const idstaff = req.body.maNv;
    const creatDate = req.body.ngayNhan;
    const expectedTime = req.body.thoiGian;
    const idService = req.body.dichVu;
    const cost = req.body.tongTien;
    const img = req.file.filename;
    const fimg = `http://verema.herokuapp.com/images/${img}`
    const hashpass = await argon2.hash(password);
    connection.query(
        'Insert into ds_tai_khoan (ten_tk, mat_khau, image, quyen) values (?,?,?,?)', [username, hashpass, "", 'kh'],
        function (err, results, fields) {
            if (results) {
                connection.query(
                    'Insert into khach_hang (ten,dia_chi,sdt, ten_tk) values(?,?,?,?)', [fullname, address, phonenumber, username],
                    function (err, results, fields) {
                        if (results) {
                            connection.query('Insert into ds_xe (ten_xe,bien_so,ten_kh,sdt,mo_ta) values (?,?,?,?,?)', [vehiname, vehiid, fullname, phonenumber, desc], function (err, results) {
                                if (results) {
                                    connection.query('Insert into phieu_sua_chua (ma_nv, ten_xe, bien_so, ten_kh, ngay_nhan, tg_du_kien, id_dv, tong_tien, img, trang_thai) values (?,?,?,?,?,?,?,?,?,"ChuaSua")', [idstaff, vehiname, vehiid, fullname, creatDate, expectedTime, idService, cost, fimg],
                                        function (err, results) {
                                            if (results) {
                                                return res.redirect('/management.ejs');
                                            } else {
                                                return res.send(err);
                                            }
                                        })
                                } else {
                                    return res.send(err);
                                }
                            })
                        } else {
                            return res.send(err);
                        }
                    }
                )
            }
            else {
                return res.render('signup.ejs', { err: 'Ten dang nhap da ton tai' });
            }
        }
    )
}
let postOrder2 = async (req, res) => {
    const fullname = req.body.tenKh;
    const phonenumber = req.body.soDt;
    const vehiname = req.body.tenXe;
    const vehiid = req.body.soXe;
    const desc = req.body.moTa;
    const idstaff = req.body.maNv;
    const creatDate = req.body.ngayNhan;
    const expectedTime = req.body.thoiGian;
    const idService = req.body.dichVu;
    const cost = req.body.tongTien;
    const img = req.file.filename;
    const fimg = `http://verema.herokuapp.com/images/${img}`
    connection.query('Insert into ds_xe (ten_xe,bien_so,ten_kh,sdt,mo_ta) values (?,?,?,?,?)', [vehiname, vehiid, fullname, phonenumber, desc], function (err, results) {
        if (results) {
            connection.query('Insert into phieu_sua_chua (ma_nv, ten_xe, bien_so, ten_kh, ngay_nhan, tg_du_kien, id_dv, tong_tien, img, trang_thai) values (?,?,?,?,?,?,?,?,?,"ChuaSua")', [idstaff, vehiname, vehiid, fullname, creatDate, expectedTime, idService, cost, fimg],
                function (err, results) {
                    if (results) {
                        return res.redirect('/management.ejs');
                    } else {
                        return res.send(err);
                    }
                })
        } else {
            return res.send(err);
        }
    })
}
let getVproduct = async (req, res) => {
    var token = req.cookies["token"];
    const all = [];
    var page = req.params.page;
    const limit = 12;
    var end;
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query('Select * from ds_phu_tung', function (err, results, fields) {
            if (results) {
                const start = (page - 1) * limit;
                if (results.length % limit == 0) {
                    end = results.length / limit;
                } else {
                    end = parseInt(results.length / limit) + 1;
                }
                connection.query(`Select * from ds_phu_tung limit ${start},${limit}`, function (err, results, fields) {
                    if (results) {
                        for (let i = 0; i < results.length; i++) {
                            all[i] = results[i];
                        }
                        return res.render('vproducts.ejs', {
                            token: token, name: rs.name, role: rs.role, detailProduct: all, Hello: "Tất cả sản phẩm", cate: null, page: page, endP: end
                        });
                    }
                })
            }
        })

    } else {
        connection.query('Select * from ds_phu_tung', function (err, results, fields) {
            if (results) {
                const start = (page - 1) * limit;
                if (results.length % limit == 0) {
                    end = results.length / limit;
                } else {
                    end = parseInt(results.length / limit) + 1;
                }
                connection.query(`Select * from ds_phu_tung limit ${start},${limit}`, function (err, results, fields) {
                    if (results) {
                        for (let i = 0; i < results.length; i++) {
                            all[i] = results[i];
                        }
                        return res.render('vproducts.ejs', { token: null, name: null, role: null, detailProduct: all, Hello: "Tất cả sản phẩm", cate: null, endP: end, page: page });
                    }
                })
            }
        })
    }
}
let getCateprod = async (req, res) => {
    const cate = req.params.catename;
    var name;
    if (cate == 'DauNhot') {
        name = 'Dầu Nhớt';
    } else if (cate == 'PhuTung') {
        name = 'Phụ Tùng';
    } else if (cate == 'VoXe') {
        name = 'Vỏ Xe';
    } else if (cate == 'PhuKien') {
        name = 'Phụ Kiện';
    }
    var token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        connection.query('Select * from ds_phu_tung where loai_pt= ?', [cate], function (err, results, fields) {
            if (results) {
                return res.render('vproducts.ejs', { token: token, name: rs.name, role: rs.role, detailProduct: results, Hello: name, cate: cate, endP: null, page: null });
            }
        })
    } else {
        connection.query('Select * from ds_phu_tung where loai_pt= ?', [cate], function (err, results, fields) {
            if (results) {
                return res.render('vproducts.ejs', { token: null, name: null, role: null, detailProduct: results, Hello: name, cate: cate, endP: null, page: null });
            }
        })
    }
}
let getRepair = async (req, res) => {
    const token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role == "kh") {
            connection.query('Select * from dich_vu', function (err, results) {
                if (results) {
                    console.log(results)
                    return res.render('repair.ejs', { token: token, name: rs.name, role: rs.role, service: results });
                }
            })
        }
        if (rs.role == "nv") {
            connection.query('Select ma_nv from nhan_vien where ten_tk = ?', [rs.name], function (err, results) {
                if (results) {
                    connection.query('Select * from phieu_sua_chua where ma_nv = ?', [results[0].ma_nv], function (err, results2) {
                        if (results2) {
                            return res.render('repair.ejs', { token: token, name: rs.name, role: rs.role, order: results2 });
                        }
                    });
                }
            })
        }
    } else {
        connection.query('Select * from dich_vu', function (err, results) {
            if (results) {
                return res.render('repair.ejs', { token: null, name: null, role: null, service: results });
            }
        })
    }
}
let getDetailorder = async (req, res, next) => {
    const id = req.params.id;
    const token = req.cookies["token"];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role = "nv") {
            connection.query('Select * from phieu_sua_chua where ma_psc = ?', [id], function (err, result) {
                if (result) {
                    return res.render('orderdetail.ejs', { token: token, role: rs.role, name: rs.name, order: result });
                }
            })
        } else {
            return res.redirect('/');
        }
    } else {
        return res.redirect('/');
    }
}
let getUpdateorder = async (req, res, next) => {
    const id = req.params.id;
    const token = req.cookies["token"];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const today = `${year}-${month + 1}-${day}`;
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role = "nv") {
            connection.query('Select * from phieu_sua_chua where ma_psc = ?', [id], function (err, result) {
                if (result) {
                    return res.render('updateorder.ejs', { token: token, role: rs.role, name: rs.name, order: result, today: today });
                }
            })
        } else {
            return res.redirect('/');
        }
    } else {
        return res.redirect('/');
    }
}
let postUpdateorder = async (req, res, next) => {
    const id = req.params.id;
    const token = req.cookies["token"];
    const rs = jwt.verify(token, 'mk');
    const ngaySua = req.body.ngaySua;
    connection.query('UPDATE phieu_sua_chua set ngay_sua = ?, trang_thai = "DangSua" where ma_psc = ? ', [ngaySua, id], function (err, results) {
        if (results) {
            connection.query('Select * from phieu_sua_chua where ma_psc = ?', [id], function (err, result) {
                if (result) {
                    return res.render('orderdetail.ejs', { token: token, role: rs.role, name: rs.name, order: result });
                }
            })
        }
    })
}
let finishOrderpc = async (req, res, next) => {
    const id = req.params.id
    const token = req.cookies["token"];
    const rs = jwt.verify(token, 'mk');
    connection.query('UPDATE phieu_sua_chua set trang_thai = "DaSua" where ma_psc = ? ', [id], function (err, results) {
        if (results) {
            connection.query('Select * from phieu_sua_chua where ma_psc = ?', [id], function (err, result) {
                if (result) {
                    return res.render('orderdetail.ejs', { token: token, role: rs.role, name: rs.name, order: result });
                }
            })
        }
    })
}
let getStaff = async (req, res, next) => {
    const id = req.params.id;
    const token = req.cookies["token"];
    let detailUser;
    if (token != null) {
        connection.query('Select * from nhan_vien where ma_nv = ?', [id], function (err, results) {
            if (results) {
                detailUser = results;
                connection.query('Select image from ds_tai_khoan where ten_tk = ?', [results[0].ten_tk], function (err, results) {
                    if (results) {
                        return res.render('profile.ejs', { detailUser: detailUser, img: results, type: "nv" })
                    }
                })
            }
        })
    } else {
        return res.redirect('/');
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
        if (role == "admin" || role == "nv") {
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
    var image = req.file;
    console.log(image);
    var img = req.file.filename;
    var tenTk = req.body.tenTk;
    connection.query(`update ds_tai_khoan set image = "http://verema.herokuapp.com/images/${img}" where ten_tk= "${tenTk}"`,
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
    if (token) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role == "admin") {
            connection.query(
                `SELECT * FROM nhan_vien WHERE ten_tk=  ${name}`,
                function (err, results, fields) {
                    if (results != null && results.length > 0) {
                        let detailUser = results;
                        connection.query(`Select image from ds_tai_khoan where ten_tk = ${name}`,
                            function (err, results, fields) {
                                return res.render('profile.ejs', { detailUser: detailUser, img: results, type: "nv" });
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
            return res.redirect('/');
        }
    } else {
        return res.redirect('/');
    }
}
let deleteAccount = async (req, res) => {
    var token = req.cookies["token"];
    var username = req.params.username;
    const role = req.params.role;
    if (token) {
        return res.render('deleteuser.ejs', { tenTk: username, role: role });
    }
    else {
        return res.redirect('/');
    }
}
let postDeleteaccount = async (req, res) => {
    const username = req.params.username;
    const role = req.params.role;
    console.log(role);
    if (role == "nv") {
        connection.query('DELETE from nhan_vien where ten_tk =?', [username], function (err, results) {
            if (results) {
                connection.query('DELETE from ds_tai_khoan where ten_tk =?', [username], function (err, results) {
                    if (results) {
                        return res.redirect('/management.ejs');
                    }
                })
            }
        })
    }
    else if (role == "kh") {
        connection.query('DELETE from khach_hang where ten_tk=?', [username], function (err, results) {
            if (results) {
                connection.query('DELETE from ds_tai_khoan where ten_tk =?', [username], function (err, results) {
                    if (results) {
                        return res.redirect('/management.ejs');
                    }
                })
            }
        })
    }
}
let updateProfile = async (req, res, next) => {
    var token = req.cookies["token"];
    var name = req.params.username;
    if (token) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role != "admin") {
            return res.redirect('/');
        }
        connection.query(
            `SELECT * FROM nhan_vien WHERE ten_tk=  ${name}`,
            function (err, results, fields) {
                if (results != null && results.length > 0) {
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
        connection.query('UPDATE khach_hang SET ten = ?, dia_chi = ?, sdt = ? WHERE ma_kh = ?', [tenkh, diachi, sdt, makh],
            function (err, results, fields) {
                if (results) {
                    return res.redirect('/management.ejs');
                }
                else {
                    return res.send(err);
                }
            }
        )
    } else {
        connection.query('UPDATE nhan_vien SET ten = ?, dia_chi = ?, sdt = ?, luong = ? WHERE ma_nv = ?', [tenkh, diachi, sdt, luong, makh],
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
                            return res.redirect('/management.ejs');
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
                        'Insert into khach_hang (ten,dia_chi,sdt, ten_tk) values(?,?,?,?)', [fullname, address, phonenumber, username],
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
                            httpOnly: true, expires: new Date(Date.now() + 1000 * 7200)
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

let getStaffcreate = async (req, res) => {
    var token = req.cookies["token"];
    if (token) {
        const rs = jwt.verify(token, "mk");
        if (rs.role != "admin") {
            return res.redirect('/');
        }
        return res.render('createstaff.ejs', { token: token, role: rs.role, mess: null });
    } else {
        return res.redirect('/');
    }
}
let postStaffcreate = async (req, res) => {
    const tenNv = req.body.tenNv;
    const gioiTinh = req.body.gioiTinh;
    const diaChi = req.body.diaChi;
    const sdt = req.body.sdt;
    const ngayS = req.body.ngayS;
    const ngayGn = req.body.ngayGn;
    const luong = req.body.luong;
    const tenTk = req.body.tenTk;
    const matKhau = req.body.matKhau;
    const img = req.file.filename;
    const uimg = `http://verema.herokuapp.com/images/${img}`;
    const hashpass = await argon2.hash(matKhau);
    const token = req.cookies["token"];
    if (token) {
        const rs = jwt.verify(token, "mk");
        if (rs.role != "admin") {
            return res.render('/');
        }
        connection.query('Insert into ds_tai_khoan (ten_tk,mat_khau,image, quyen) values (?,?,?,"nv")', [tenTk, hashpass, uimg], function (err, results) {
            if (results) {
                connection.query("Insert into nhan_vien (ten, gioi_tinh, dia_chi, sdt, ngay_sinh, ngay_gianhap, luong, ten_tk) values (?,?,?,?,?,?,?,?)", [tenNv, gioiTinh, diaChi, sdt, ngayS, ngayGn, luong, tenTk],
                    function (err, results) {
                        if (results) {
                            return res.render('createstaff.ejs', { token: token, role: rs.role, mess: "Thanh cong" });
                        } else {
                            return res.send(err);
                        }
                    })
            } else {
                return res.render('createstaff.ejs', { token: token, role: rs.role, mess: "Da ton tai" });
            }
        })

    } else {
        return res.render('/');
    }
}
let postDeletemess = async (req, res) => {
    const id = req.params.idmess;
    connection.query('delete from lien_lac where ma_ll =?', [id], function (err, results) {
        if (results) {
            return res.redirect('/management.ejs');
        }
    })
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
    const uimg = `http://verema.herokuapp.com/images/${img}`;
    const mt = req.body.mieuTa;
    const pl = req.body.phanLoai;
    if (gia < 0) {
        return res.render('addprod.ejs', { message: 'Gia khong hop le', role: 'admin' });
    }
    connection.query('Insert into ds_phu_tung (ten_pt,don_gia,so_luong,image,description, loai_pt) values (?,?,?,?,?,?)', [ten, gia, sl, uimg, mt, pl],
        function (err, results, fields) {
            if (results) {
                return res.render('addprod.ejs', { message: 'Thanh Cong', role: 'admin' });
            } else {
                return res.render('addprod.ejs', { message: 'Da ton tai', role: 'admin' });
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
    const uimg = `http://verema.herokuapp.com/images/${img}`;
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

let getDelprod = async (req, res) => {
    var token = req.cookies["token"];
    const ten = [];
    if (token != null) {
        const rs = jwt.verify(token, 'mk');
        if (rs.role != "admin") {
            return res.redirect('/');
        }
        connection.query('Select * from ds_phu_tung', function (err, results) {
            if (results) {
                for (let i = 0; i < results.length; i++) {
                    ten.push(results[i].ten_pt);
                }
                return res.render('deleteprod.ejs', { token: token, name: rs.name, role: rs.role, mess: 'Hay can nhac ki', ten: ten });
            } else {
                return res.render('deleteprod.ejs', { token: token, name: rs.name, role: rs.role, mess: 'Loi', ten: null });
            }
        })
        //return res.render('deleteprod.ejs', { token: token, name: rs.name, role: rs.role, mess: null, ten: null });
    } else {
        return res.redirect('/');
    }
}
let postDelprod = async (req, res) => {
    const tenpt = req.body.tenPt;
    const ten = [];
    var token = req.cookies["token"];
    const rs = jwt.verify(token, 'mk');
    connection.query('DELETE from ds_phu_tung where ten_pt =?', [tenpt], function (err, results) {
        if (results) {
            connection.query('Select * from ds_phu_tung', function (err, results) {
                if (results) {
                    for (let i = 0; i < results.length; i++) {
                        ten.push(results[i].ten_pt);
                    }
                    return res.render('deleteprod.ejs', { token: token, name: rs.name, role: rs.role, mess: 'Xoa thanh cong', ten: ten });
                } else {
                    return res.render('deleteprod.ejs', { token: token, name: rs.name, role: rs.role, mess: 'Loi', ten: ten });
                }
            })
        }
    })
}
let getConfirmdel = async (req, res) => {
    var token = req.cookies["token"];
    if (token) {
        const ten = req.params.ten;
        return res.render('confirmdelete.ejs', { tenPt: ten });
    }
    else {
        return res.render('/');
    }
}
let postConfirmdel = async (req, res) => {
    const tenPt = req.params.ten;
    connection.query('Delete from ds_phu_tung where ten_pt = ?', [tenPt], function (err, results) {
        if (results) {
            return res.redirect('/management.ejs');
        }
    })
}

let chatApp = async (req, res, next) => {
    const token = req.cookies["token"];
    if (token) {
        return res.render('chat.ejs', { token: token });
    } else {
        return res.render('chat.ejs', { token: null });
    }

}


module.exports = {
    getHome, getAbout, getContact, postContact, getFurni, getManage, getProfile, getSignup, postSignup, postSignin, getSignin, postLogout, accountProfile, chatApp, updateProfile, postUpdate, uploadImg,
    getVproduct, getAddprod, postAddprod, getUpdateprod, postUpdateprod, getUpdateOneProd, getCateprod, getDelprod, postDelprod, getConfirmdel, postConfirmdel, getStaffcreate, postStaffcreate,
    getRepair, deleteAccount, postDeleteaccount, postDeletemess, postOrder, postOrder2, getDetailorder, getStaff, getUpdateorder, postUpdateorder, finishOrderpc
}