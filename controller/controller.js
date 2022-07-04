/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const db = require('../database/models/db.js');
const User = require('../database/models/User.js');
const Movie = require('../database/models/Movie.js');
const bcrypt = require('bcryptjs');

// Add other databases here as well

const controller = {
    // Initial page is the sign up page to indicate that the user cannot go to the main website without first making an account or logging in.
    getInitial: function(req, res) {
        if (req.session.email == undefined)
            res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'});
        else
        {
            db.findMany(Movie, {}, 'm_name m_image m_id' , function(result){ // 
                var transaction = result;
                res.render('index', {layout: '/layouts/layout.hbs', movie:transaction, title: "Main - Filmworks"});
            });
        }
    },

    // checks if the account is already in the database through the email
    checkEmail: function(req, res) {
        var email = req.query.email;
        db.findOne(User, {email: email}, 'email', function(result){
            res.send(result);
        })
    },

    //checks if the username has already been taken and is found in the database 
    checkUsername: function(req,res){
        var username = req.query.username;
        db.findOne(User, {username: username}, 'username', function(result){
            res.send(result);
        })
    },

    //gets the register page 
    getRegister: function (req, res) {
        if (req.session.email == undefined)
            res.render('sign_up', {layout: '/layouts/prelogin.hbs',  title: 'Sign-Up - Filmworks'});
    },

    // adds the account to the database once it has been registered
    postRegister: function(req, res) {
        var valid = true;
        
        if (req.body.username.length < 5 || req.body.password.length < 8) {
            valid = false;
        }

        if (valid == false) {
            res.redirect('/');
        }
        else {
            var img = "";
            if (Boolean(req.body.status) == true) {
                if (req.files == undefined) {
                    var info = {
                        error:'No file was uploaded despite checking the checkbox. Please try again.'
                    }
                    res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
                        error: info.error,
                        title: 'Sign-Up - Filmworks'
                    });
                    return;
                }
                else {
                    var img = req.files.file;
                    img.mv('./public/status/' + img.name, function(err){
                        if (err) {
                            res.redirect('/');
                        }
                    });
                }
            }

            var user = {
                username: req.body.username,
                f_name: req.body.f_name,
                l_name: req.body.l_name,
                email: req.body.email,
                password: req.body.password,
                status: Boolean(req.body.status), //checkbox value
                image: "",
            }

            var check = user.username + "none"

            if (img == "")
                user.image = check;
            else
                user.image = './public/status/' + img.name;

            if (user.status == true && user.image != check) {
                user.status = "SENIOR CITIZEN/PWD";
            }
            else {
                user.status = "REGULAR";
            }
            
            bcrypt.hash(user.password, 10, function(err, hash) {
                user.password = hash;

                db.insertOne(User, user, function(result){
                    if (result) {
                        res.redirect('/login');
                    }
                    else
                        res.redirect('/'); //redirects to sign up
                });
            });
        }
    },

    //gets the login page
    getLogin: function (req, res) {
        if (req.session.email == undefined)
            res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'});
    },

    // if the person is logging in, it checks if the account is first part of database and that the info is correct.
    // if the info is correct, user will be redirected to main page.
    postLogin: function (req, res) {
        var email = req.body.l_email;
        var password = req.body.l_password;

        db.findOne(User, {email:email}, '', function(result){
            if (result) {
                var lname = result.l_name;
                var fname = result.f_name;
                var user = result.username;
                bcrypt.compare(password, result.password, function(err, result) {
                    if(result) {
                        req.session.email = email;
                        req.session.l_name = lname;
                        req.session.f_name = fname;
                        req.session.username = user;

                        res.redirect('/main'); //means correct and should go back to main page
                    }
                    else {  
                        var info = {
                            error:'Email/Password is incorrect or does not exist. Please try again.'
                        }

                        res.render('sign_in',{layout: '/layouts/prelogin.hbs', 
                            error: info.error,
                            title: 'Sign-In - Filmworks'
                        });
                    }    
                })
            }
            else {
                var info = {
                    error:'Email/Password is incorrect or does not exist. Please try again.'
                }
                
                res.render('sign_in',{layout: '/layouts/prelogin.hbs', 
                    error: info.error,
                    title: 'Sign-In - Filmworks',
                });
            }
        });
    },

    // gets the account details of the user logged in and displays it
    getAccount: function(req,res){
        //checks the account logged in and renders that one
        if (req.session.email != undefined) {
            var email = req.session.email;
            db.findOne(User, {email: email}, null, function(result){
                if(result) { //email was found
                    var doneMovies = [];
                    var premieringMovies = [];
                    var currentDate = new Date ();
                    
                    if (result.movieDetails) {
                        for (i = 0; i < result.movieDetails.length; i++){
                            if (currentDate > result.movieDetails[i].date) {
                                doneMovies.push(result.movieDetails[i]);
                            }
                            else
                                premieringMovies.push(result.movieDetails[i]);
                        }
                    }

                    res.render('account',{layout: '/layouts/account.hbs',
                        username: result.username,
                        f_name: result.f_name,
                        l_name: result.l_name,
                        status: result.status,
                        doneMovie: doneMovies,
                        premieringMovies: premieringMovies,
                        title: 'Account - Filmworks'
                    });
                }
            })
        }
        else
            res.redirect('/');
    },

    // renders the specific ticket information of the user
    postTicket: function(req, res) {
        var movie = req.body.id;

        db.findOne(Movie, {m_id: movie}, null, function(result) {
            if(result) {
                res.render('ticket', {layout: '/layouts/ticket.hbs', 
                    m_image: result.m_image, 
                    m_name: result.m_name,
                    m_cast: result.m_cast,
                    m_synopsis: result.m_synopsis,
                    username: req.session.username,
                    l_name: req.session.l_name,
                    f_name: req.session.f_name,
                    quantity: req.body.quantity,
                    timeslot: req.body.timeslot,
                    title: result.m_name + " - Filmworks",
                });
            }
        });        
    },

    // checks if regular or pwd/senior
    getStatus: function(req, res){
        db.findOne(User, {email: req.session.email}, 'status', function (result){
            res.send(result.status);
        })
    },

    //deletes the account of the user and then exits from the session
    getDeleteAccount: function (req, res) {
        var username = req.query.username;
            db.findOne(User, {username: username}, 'username', function(result){
                db.deleteOne(User, {username: result.username}, function(result){
                    req.session.destroy(function(error){
                        if (error)
                            throw error;
                    });
                    res.send(result);
                });
            });
    },

    // logouts from the website and destroys the session
    getLogout: function (req, res) {
        req.session.destroy(function(error){
            if (error)
                throw error;
            res.redirect('/');
        });
    }
}

module.exports = controller;