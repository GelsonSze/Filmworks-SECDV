const { Association } = require('sequelize')
const {users, admins, sessions, bannedIPs} = require('../models/')
const {movies, carts, cart_movies, transactions, time_slots} = require('../models/')

const db = require('../models/index.js')

const cart_controller = {
    getCart: async function(req, res) {
        const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
        // const usercart = await carts.findAll({where: {userID: user.userID}, include:movies})
        const userCart = await carts.findOne({where: {userID: user.userID}})
        const userCartMovies = await cart_movies.findAll({where: {cartID: userCart.cartID}})
        
        var totalPrice = 0;
        var totalQuantity = 0;
        const cartMoviePromises = userCartMovies.map(async (cartMovie)=>{
            var movie = await movies.findOne({where: {movieID: cartMovie.movieID}})
            cartMovie['movie'] = movie
            totalQuantity = totalQuantity + cartMovie.quantity;
            totalPrice = totalPrice + (movie.price * cartMovie.quantity);
        })

        await Promise.all(cartMoviePromises)

        res.render('cart', {layout: '/layouts/account.hbs', 
                            item: userCartMovies, 
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
        const movie = await movies.findOne({where: {movieID: req.body.movieID}, include: time_slots})
        const quantity = req.body.quantity
        const timeslotRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM) - (0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/gm
        const timeslot = req.body.timeslot
        if(process.env.NODE_ENV == "development"){
            console.log("ADD MOVIE TO CART: movie details")
            console.log(movie)
        }

        try{
            if (movie && !isNaN(quantity) && timeslotRegex.test(timeslot)) { //movie was found, quantity is a number, and timeslot is valid format
                if(process.env.NODE_ENV == "development"){
                    console.log("Add movie if statement successful")
                }
                const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
                const userCart = await carts.findOne({where: {userID: user.userID}})
                const userCartMovies = await cart_movies.findAll({where: {cartID: userCart.cartID}})

                starttime = timeslot.split("-")[0].trim()
                endtime = timeslot.split("-")[1].trim()
                validtime = false

                //check if time slot input is valid
                movie.time_slots.forEach(async (time_slot)=>{
                    if (starttime == time_slot.start_time && endtime == time_slot.end_time){
                        validtime = true;
                    }
                })
                
                if(!validtime){
                    throw `Invalid time slot values\ngiven start time: ${starttime} end time: ${endtime}`;
                }
                
                //check user current movies and if id already exists prior and if same time
                //then update cart and increase ticket count 
                var existing = await cart_movies.findOne({where: {cartID: userCart.cartID, movieID: movie.movieID, 
                                                        start_time: starttime, end_time: endtime}})
                
                if (existing){
                    var newquantity = existing.quantity += Number(quantity)
                    if(process.env.NODE_ENV == "development"){console.log("Adding existing movie with same time slot to cart")}
                    await cart_movies.update({"quantity": newquantity},{where: {id: existing.id}})
                }
                //else add row
                else{
                    if(process.env.NODE_ENV == "development"){console.log("Adding new movie to cart")}
                    //else just add regularly to cart
                    await cart_movies.create({
                        "cartID": userCart.cartID,
                        "movieID": movie.movieID,
                        "quantity": Number(quantity),
                        "date": Date.now(),
                        "start_time": starttime,
                        "end_time": endtime,
                    })
                }

                if(process.env.NODE_ENV == "development"){
                    console.log("PRINTING USER CART")
                    console.log(userCart)
                    console.log("PRINTING Cart Movies")
                    console.log(userCartMovies)
                }
                res.sendStatus(200)
            } else {
                throw "Invalid inputs"
            }
        }catch(error){
            if(process.env.NODE_ENV == "development"){
                console.log(`Error caught in addMovieToCart with error: \n${error}\n${error.stack}`)
            }
            //movie selection does not exist and/or input has errors 
            //display error page
            res.sendStatus(500);
        }
    },

    deleteMovieFromCart: async function(req, res){
        //delete one copy of movie from cart db
        console.log("IN DELETE MOVIE CART")
        itemID = req.params.cartItemID

        const item = await cart_movies.findOne({where: {id: itemID}})
        if (item) { //means movie in cart was found
            // const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
            // const usercart = await carts.findOne({where: {userID: user.userID}})
            //else just remove regularly to cart
            cart_movies.destroy({where: {id: itemID}})
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