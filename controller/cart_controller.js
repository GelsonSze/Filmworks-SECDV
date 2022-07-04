/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const db = require('../database/models/db.js');
const User = require('../database/models/User.js');
const Cart = require('../database/models/Cart.js');
const Movie = require('../database/models/Movie.js');

const cart_controller = {
    // displays all movies currently in the cart of the user
    getCart: function(req, res) {
        if (req.session.email != undefined) {
            db.findMany(Cart, {email: req.session.email}, null, function(result){
                res.render('cart', {layout: '/layouts/account.hbs', item: result, title: "Cart - Filmworks"});
           })
        }
        else
            res.redirect('/');
    },

    // adds movie to the cart of the user in the database. 
    // if the movie already exists in the user's cart, the quanitity of tickets is incremented instead
    addMovieCart: function (req, res) {
        db.findOne(Cart, {email: req.session.email, movie_id: req.query.m_id, movie_timeSlot: req.query.movie_timeSlot}, null, function(result) {
            if (result == null) {
                db.findOne(Movie, {m_id: req.query.m_id}, null, function (result) { 
                    var item = {
                        email: req.session.email,
                        movie_id: result.m_id,
                        movie_date: req.query.movie_date,
                        movie_name: result.m_name,
                        movie_img: result.m_image,
                        movie_timeSlot: req.query.movie_timeSlot,
                        price: result.m_price,
                        quantity: req.query.quantity
                    }

                    db.insertOne(Cart, item, function (result) {
                        res.send(result);   
                    });
                });
            }
            else {
                db.updateOne(Cart, {email: req.session.email, movie_id: req.query.m_id, movie_timeSlot: req.query.movie_timeSlot}, {$inc: {quantity: req.query.quantity}}, function (result) {
                    res.send(result);
                });
            }
        });
    },

    // deletes the movie from the cart of the user in the database
    deleteItem: function(req, res) {
        db.deleteOne(Cart, {email: req.session.email, movie_id: req.query.movie_id, movie_timeSlot: req.query.movie_timeSlot}, function(result){
            res.send(result);
        });
    },

    // opens payment page
    getPayment: function(req,res){
        if (req.session.email != undefined)
            res.render('payment', {layout: '/layouts/layout.hbs', title: "Payment - Filmworks"});
        else
            res.redirect('/');
    },

    // passes the data in payment page
    postPayment: function(req,res){
        //check if exp date is not current date
        var exp = new Date(Date.parse(req.body.expiration));
        var current = new Date(); //current date
        if (exp.getTime() > current.getTime() && isNaN(req.body.cardnum) == false) { //exp date is newer or later 

            db.findMany(Cart, {email: req.session.email}, null, function (result){
                // adds the details of the movie in the cart checked out to the user
                for (i = 0; i < result.length; i++){
                    db.updateOne(User, {email: req.session.email}, {$push: {movieDetails : {id: result[i].movie_id, date: result[i].movie_date, timeslot: result[i].movie_timeSlot, quantity: result[i].quantity, m_image: result[i].movie_img }}}, function (updating){});
                }

                // reduces the number of tickets ordered by the user from the databse
                for (j = 0; j < result.length; j++){
                    var order = -Math.abs(result[j].quantity);
                    db.updateOne(Movie, {m_id: result[j].movie_id, "ticket.date": result[j].movie_date}, {$inc:{"ticket.$.quantity": order}}, function (value){});
                }
            });
            
            // deletes the cart of the user
            db.deleteMany(Cart, {email: req.session.email}, function (deleting) {});
            
            res.redirect('/account');
        }
        else {
            res.redirect('/main');
        }
    }
}

module.exports = cart_controller;