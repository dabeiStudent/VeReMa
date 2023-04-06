import connection from "../config/connect2MySQL";

//Trang chu
let getHome = (req, res) => {
    connection.query(
        'SELECT * FROM `user`',
        function (err, results, fields) {
            //console.log(results);
            //for mobile
            //return res.json(results)
            return res.render('index.ejs', { dataUser: JSON.stringify(results) })
        }
    );
}

module.exports = {
    getHome
}