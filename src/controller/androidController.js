import connection from "../config/connect2MySQL";
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const signIn = async (req, res, next) => {
    var username = req.body.userName;
    var password = req.body.passWord;
    if (!username || !password)
        return res.status(400).send({ success: false, message: 'Missing username or password' });
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
                        return res.status(404).send({ success: false, message: 'Incorrect username or password' });
                    }
                } else {
                    return res.status(404).send({ success: false, message: 'Incorrect username or password' });
                }
            }
        )
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message });
    }
}



module.exports = {
    signIn
}