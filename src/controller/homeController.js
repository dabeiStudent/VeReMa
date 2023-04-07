import connection from "../config/connect2MySQL";

//Trang chu
let getHome = async (req, res) => {
    return await res.render('index.ejs');
}
let getAbout = async (req, res) => {
    await connection.query(
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
    return await res.render('contact.ejs');
}
let getFurni = async (req, res) => {
    return await res.render('furnitures.ejs');
}
let getTesti = async (req, res) => {
    return await res.render('testimonial.ejs');
}
let getProfile = async (req, res) => {
    const id = req.params.userid;
    await connection.query(
        `SELECT * FROM nhan_vien WHERE ma_nv=  ${id}`,
        function (err, results, fields) {
            console.log(results);
            return res.render('detail.ejs', { detailUser: results });
        }
    )
}

module.exports = {
    getHome, getAbout, getContact, getFurni, getTesti, getProfile
}