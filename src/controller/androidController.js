import connection from "../config/connect2MySQL";
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

//Xu li dang nhap
const signInmb = async (req, res, next) => {
    var username = req.body.userName;
    var password = req.body.passWord;
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Missing username or password' });
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
                        return res.status(200).json({ success: true, message: 'Logged in', token: token, user: results })
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
            return res.status(200).json({ allAccounts: results });
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
const findCusmb = async (req, res, next) => {
    const name = req.body.tenKh;
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
    const name = req.body.tenNv;
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
module.exports = {
    signInmb, getAccountmb, getStaffmb, getCusmb, findCusmb, findStaffmb
}