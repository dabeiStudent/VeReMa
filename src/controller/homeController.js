import connection from "../config/connect2MySQL";

//Trang chu
let getHome = (req, res) => {
    return res.render('index.ejs');
}
let getAbout = (req, res) => {
    connection.query(
        'SELECT * FROM `nhan_vien`',
        function (err, results, fields) {
            //console.log(results);
            //for mobile
            //return res.json(results)
            return res.render('about.ejs', { dataUser: JSON.stringify(results) })
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


module.exports = {
    getHome, getAbout, getContact, getFurni, getTesti
}