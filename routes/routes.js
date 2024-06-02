const express = require(`express`);
const app = express();


app.get(`/`, function(req, res) {
    if (req.session.email == undefined)
        res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'})});

module.exports = app;
