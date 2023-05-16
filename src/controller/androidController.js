import { name } from "ejs";
import connection from "../config/connect2MySQL";
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

//Xu li dang nhap
const signInmb = async (req, res, next) => {
    var user;
    var username = req.body.userName;
    var password = req.body.passWord;
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Missing username or password' });
    try {
        connection.query(
            'Select * from ds_tai_khoan where ten_tk = ?', [username],
            function (err, results, fields) {
                if (results.length > 0) {
                    const validPassword = argon2.verify(results[0].mat_khau, password);
                    if (validPassword) {
                        const token = jwt.sign({ id: results[0].ma_tk, name: results[0].ten_tk, role: results[0].quyen }, 'mk');
                        user = results;
                        var nameacc = user[0].ten_tk;
                        if (results[0].quyen == "admin" || results[0].quyen == "nv") {
                            connection.query('Select ten, dia_chi, sdt from nhan_vien where ten_tk=?', [nameacc], function (err, results) {
                                if (results.length > 0) {
                                    return res.status(200).json({ success: true, message: 'Logged in', token: token, user: user, detail: results });
                                }
                            })
                        } else {
                            connection.query('Select ten, dia_chi, sdt from khach_hang where ten_tk=?', [nameacc], function (err, results) {
                                if (results.length > 0) {
                                    return res.status(200).json({ success: true, message: 'Logged in', token: token, user: user, detail: results });
                                }
                            })
                        }
                        // //Doi type tu array sang object de doc trong android
                        // const user = Object.assign({}, results);
                        // Object.assign(user, { user: user['0'] });
                        // delete user['0'];
                    } else {
                        return res.status(404).json({ success: false, message: 'Incorrect username or password' });
                    }
                } else {
                    return res.status(404).json({ success: false, message: 'Incorrect username or password' });
                }
            }
        )
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
//Xu li cac van de ve GET
const getAccountmb = async (req, res, next) => {
    connection.query('Select * from ds_tai_khoan', function (err, results) {
        if (results) {
            return res.status(200).json({ success: true, allAccounts: results });
        } else {
            return res.status(404).json({ err: err });
        }
    })
}
const getCusmb = async (req, res, next) => {
    connection.query('Select * from khach_hang', function (err, results) {
        if (results) {
            return res.status(200).json({ allCustomers: results });
        } else {
            return res.status(404).json({ err: err });
        }
    })
}
const getStaffmb = async (req, res, next) => {
    connection.query('Select * from nhan_vien', function (err, results) {
        if (results) {
            return res.status(200).json({ allStaffs: results });
        } else {
            return res.status(404).json({ err: err });
        }
    })
}
const getProdmb = async (req, res, next) => {
    connection.query('Select * from ds_phu_tung', function (err, results) {
        if (results) {
            return res.status(200).json({ allProds: results });
        } else {
            return res.status(404).json({ err: err });
        }
    })
}
const findCusmb = async (req, res, next) => {
    const name = req.body.ten;
    if (!name) {
        return res.status(400).json({ err: 'Vui lòng nhập tên' });
    }
    connection.query(`Select * from khach_hang where ten_kh='${name}'`, function (err, results) {
        if (results) {
            return res.status(200).json({ customer: results });
        } else {
            return res.status(404).json({ err: err });
        }
    })
}
const findStaffmb = async (req, res, next) => {
    const name = req.body.ten;
    if (!name) {
        return res.status(400).json({ err: 'Vui lòng nhập tên' });
    }
    connection.query(`Select * from nhan_vien where ten_nv='${name}'`, function (err, results) {
        if (results) {
            return res.status(200).json({ staff: results });
        } else {
            return res.status(404).json({ err: err });
        }
    })
}

const editStaffProfile = async (req, res, next) => {
    const name = req.body.ten;
    const username = req.body.username;
    const phone = req.body.sdt;
    const address = req.body.dia_chi;
    connection.query('Select ma_nv from nhan_vien where ten_tk =?', [username], function (err, results, fields) {
        if (results) {
            connection.query('UPDATE nhan_vien SET ten = ?, sdt = ?, dia_chi = ? WHERE ma_nv = ?', [name, phone, address, results[0].ma_nv], function (err, results) {
                if (results) {
                    return res.status(200).json({ message: "success" });
                }
            })
        }
    })
}
const editCustomerProfile = async (req, res, next) => {
    const name = req.body.ten;
    const username = req.body.username;
    const phone = req.body.sdt;
    const address = req.body.dia_chi;
    connection.query('Select ma_kh from khach_hang where ten_tk =?', [username], function (err, results, fields) {
        if (results) {
            connection.query('UPDATE khach_hang SET ten = ?, sdt = ?, dia_chi = ? WHERE ma_kh = ?', [name, phone, address, results[0].ma_kh], function (err, results) {
                if (results) {
                    return res.status(200).json({ message: "success" });
                }
            })
        }
    })
}

let newOrder = async (req, res) => {
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
                                    connection.query('Insert into phieu_sua_chua (ma_nv, ten_xe, bien_so, ten_kh, ngay_nhan, tg_du_kien, id_dv, tong_tien, trang_thai) values (?,?,?,?,?,?,?,?,"ChuaSua")', [idstaff, vehiname, vehiid, fullname, creatDate, expectedTime, idService, cost],
                                        function (err, results) {
                                            if (results) {
                                                return res.status(200).json({ message: "success" });
                                            } else {
                                                return res.status(400).json({ message: err });
                                            }
                                        })
                                } else {
                                    return res.status(400).json({ message: err });
                                }
                            })
                        } else {
                            return res.status(400).json({ message: err });
                        }
                    }
                )
            }
            else {
                return res.status(400).json({ message: "Tên tài khoản đã tồn tại" });
            }
        }
    )
}
let allOrder = async (req, res, next) => {
    connection.query('Select * from phieu_sua_chua', function (err, results) {
        if (results) {
            return res.status(200).json({ allOrders: results });
        }
    })
}
module.exports = {
    signInmb, getAccountmb, getStaffmb, getCusmb, getProdmb, findCusmb, findStaffmb, editStaffProfile, editCustomerProfile, newOrder, allOrder
}