const express = require(`express`);
const app = express();

const credentials_controller = require('../controller/credentials_controller')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/uploads/')
    },
    filename: function(req, file, callback){
        console.log(file)

        callback(null, Date.now() + "_" + file.originalname)
    }
})
const upload = multer({storage: storage})

app.get(`/`, function(req, res) {
    if (req.session.email == undefined)
    res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

app.get(`/register`, function(req, res) {
    if (req.session.email == undefined)
        res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'})
});

app.post(`/postregister`, upload.single("file"), credentials_controller.successfulRegister)

app.get(`/login`, function(req, res) {
    if (req.session.email == undefined)
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
});

module.exports = app;
