const { Association } = require('sequelize')
const {users, admins, sessions, bannedIPs} = require('../models/')
const {movies, carts, cart_movies, transactions} = require('../models/')

const db = require('../models/index.js')
const maxQuantity = 250; //max quantity of movie

const cart_controller = {
    getCart: async function(req, res) {
        const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
        const usercart = await carts.findOne({where: {userID: user.userID}, include:movies})

        var totalPrice = 0;
        var totalQuantity = 0;
        usercart.movies.forEach(async (movie)=>{
            totalQuantity = totalQuantity + movie.cart_movies.quantity;
            totalPrice = totalPrice + (movie.price * movie.cart_movies.quantity);
        })
        res.render('cart', {layout: '/layouts/account.hbs', 
                            item: usercart.movies, 
                            totalPrice: totalPrice, 
                            totalQuantity: totalQuantity, 
                            title: "Cart - Filmworks"});
    },

    addMovieToCart: async function(req, res){
        if(process.env.NODE_ENV == "development"){
            console.log("addMovieToCart req.body: ")
            console.log(req.body)
        }
        //modify this to get the ID of the movie clicked by user or title and etc
        const movie = await movies.findOne({where: {movieID: req.body.movieID}})
        const quantity = req.body.quantity

        
        if (movie && !isNaN(quantity) && (Number(quantity) < maxQuantity)) { //means movie was found
            if(process.env.NODE_ENV == "development"){
                console.log("Add movie if statement successful")
            }
            const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
            const usercart = await carts.findOne({where: {userID: user.userID}})
            const cartmovies = await cart_movies.findAll({where: {cartID: usercart.cartID}})
            var existing = cartmovies.find((cartmovie)=> cartmovie.movieID === movie.movieID)
            //check user current movies and if id already exists prior, update cart and increase ticket count
            if (existing){
                var newquantity = existing.quantity += Number(quantity)
                await cart_movies.update({"quantity": newquantity}, 
                    {where: {cartID: existing.cartID, movieID: existing.movieID}})
            }
            else{
                //else just add regularly to cart
                await cart_movies.create({
                    "cartID": usercart.cartID,
                    "movieID": movie.movieID,
                    "quantity": Number(quantity)
                })
            }

            if(process.env.NODE_ENV == "development"){
                console.log("PRINTING USER CART")
                console.log(usercart)
                console.log("PRINTING Cart Movies")
                console.log(cartmovies)
            }
            res.sendStatus(200)
        } else {
            if(process.env.NODE_ENV == "development"){
                console.log("Add movie if statement failed")
            }
            //movie selection does not exist and/or input has errors 
            //display error page
            res.sendStatus(500);
        }
        
    },

    deleteMovieFromCart: async function(req, res){
        //delete one copy of movie from cart db
        const movie = await movies.findOne({where: {movieID: req.params.movieID}})
        if (movie) { //means movie was found
            const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
            const usercart = await carts.findOne({where: {userID: user.userID}})
            
            //else just add regularly to cart
            usercart.removeMovie(movie.movieID)
            res.sendStatus(200);
        }
        else {
            //movie selection does not exist and has errors
            //display error page
            res.status(500).redirect('/error');
        }
    },

    // opens payment page
    getPayment: async function(req,res){
        const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
        const usercart = await carts.findOne({where: {userID: user.userID}, include:'movies'})
        if (usercart.movies.length != 0)
            res.render('payment', {layout: '/layouts/layout.hbs', title: "Payment - Filmworks"});
        else
            res.redirect('/cart')
    },

    // passes the data in payment page
    postPayment: async function(req,res){

        console.log("Entered payment")
        console.log(req.body)

        const cardNumRegex = /^[0-9]{16}$/g
        const nameRegex = /^[a-zA-Z\s]+$/
        const cardExpireRegex = /^[0-9]{4}\/(0[1-9]|1[0-2])$/
        const cvvRegex = /^[0-9]{3}$/g

        if(cardNumRegex.test(req.body.cardnum) && nameRegex.test(req.body.fullname)
        && cardExpireRegex.test(req.body.expiration) && cvvRegex.test(req.body.cvv)){
            const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
            const usercart = await carts.findOne({where: {userID: user.userID}, include:movies})

            usercart.movies.forEach(async (movie)=>{
                totalPrice = movie.price * movie.cart_movies.quantity;
                creditCardNumber = req.body.cardnum
                await transactions.create({
                    "title": movie.title,
                    "date": Date.now(),
                    "start_time": "12:00 PM",
                    "end_time": "02:30 PM",
                    "individual_price": movie.price,
                    "quantity_purchased": movie.cart_movies.quantity,
                    "total_price": totalPrice,
                    "credit_card": "**** ".repeat(3) + creditCardNumber.substr(creditCardNumber.length - 4),
                    "date_purchased": Date.now(),
                    "userID": user.userID
                })
                usercart.removeMovie(movie.movieID)
            })
            res.redirect('/account')
        }
        else{
            //failed payment
            res.status(500).redirect('/error');
        }
        
    }


    
}

module.exports = cart_controller