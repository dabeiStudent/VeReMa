import connection from "../config/connect2MySQL";

//Trang chu
let getHome = (req, res) => {
    return res.render('index.ejs');
}
let getAbout = (req, res) => {
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
let getContact = (req, res) => {
    return res.render('contact.ejs');
}
let getFurni = (req, res) => {
    return res.render('furnitures.ejs');
}
let getTesti = (req, res) => {
    return res.render('testimonial.ejs');
}
let getProfile = (req, res) => {
    const id = req.params.userid;
    connection.query(
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