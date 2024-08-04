const {users, admins, sessions, bannedIPs} = require('../models/')
const {movies, carts, cart_movies, transactions, time_slots, movie_times} = require('../models/')
const {sequelize} = require('../models/index.js')
const winston = require('winston')

const devLogger = winston.loggers.get('DevLogger')
const userActivityLogger = winston.loggers.get('UserActivityLogger')
const transactionLogger = winston.loggers.get('TransactionLogger')

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
                var result = await sequelize.transaction(async t =>{
                    const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}},{transaction: t})
                    const userCart = await carts.findOne({where: {userID: user.userID}},{transaction: t})
                    const userCartMovies = await cart_movies.findAll({where: {cartID: userCart.cartID}},{transaction: t})

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
                                                            start_time: starttime, end_time: endtime}},{transaction: t})
                    
                    if (existing){
                        var newquantity = existing.quantity += Number(quantity)

                        await cart_movies.update({"quantity": newquantity},{where: {id: existing.id}},{transaction: t})

                        if(process.env.NODE_ENV == "development"){
                            devLogger.info(`User ${user.userID} updated quantity of movie ${movie.movieID} in their cart`)
                        }else{
                            userActivityLogger.info(`User ${user.userID} updated quantity of movie ${movie.movieID} in their cart`)
                        }
                    }
                    //else add row
                    else{
                        //else just add regularly to cart
                        await cart_movies.create({
                            "cartID": userCart.cartID,
                            "movieID": movie.movieID,
                            "quantity": Number(quantity),
                            "date": Date.now(),
                            "start_time": starttime,
                            "end_time": endtime,
                        },{transaction: t})
                    }

                    if(process.env.NODE_ENV == "development"){
                        devLogger.info(`User ${user.userID} successfully added movie ${movie.movieID} to their cart`)
                    }else{
                        userActivityLogger.info(`User ${user.userID} successfully added movie ${movie.movieID} to their cart`)
                    }
                    
                    res.sendStatus(200)
                })
            } else {
                throw "Invalid inputs"
            }
        }catch(error){

            if(process.env.NODE_ENV == "development"){
                devLogger.error(`User ${user.userID} failed to add movie ${movie.movieID} to their cart: ${error.stack}`)
            }else{
                userActivityLogger.error(`User ${user.userID} failed to add movie ${movie.movieID} to their cart`)
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

            if(process.env.NODE_ENV == "development"){
                devLogger.info(`Movie ${item.movieID} successfully deleted from cart: ${item.cartID}`)
            }else{
                userActivityLogger.info(`Movie ${item.movieID} successfully deleted from cart: ${item.cartID}`)
            }

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
        try{
            const cardNumRegex = /^[0-9]{16}$/g
            const nameRegex = /^[a-zA-Z\s]+$/
            const cardExpireRegex = /^[0-9]{4}\/(0[1-9]|1[0-2])$/
            const cvvRegex = /^[0-9]{3}$/g

            if(cardNumRegex.test(req.body.cardnum) && nameRegex.test(req.body.fullname)
            && cardExpireRegex.test(req.body.expiration) && cvvRegex.test(req.body.cvv)){
                var result = await sequelize.transaction(async t =>{
                    const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}},{transaction: t})
                    const userCart = await carts.findOne({where: {userID: user.userID}},{transaction: t})
                    const userCartMovies = await cart_movies.findAll({where: {cartID: userCart.cartID}},{transaction: t})

                    return sequelize.transaction(async t2 =>{
                        var flag = true;
                        const userCartMoviesPromises = await userCartMovies.map(async (cartMovie)=>{
                            try{
                                var movie = await movies.findOne({where: {movieID: cartMovie.movieID}},{transaction: t2})
                                creditCardNumber = req.body.cardnum
                                totalPrice = movie.price * cartMovie.quantity;
                                await movies.findAll({where: {movieID: cartMovie.movieID}, include:time_slots},{transaction: t2}).then(element =>{
                                    movietimes = element[0]
                                    movietimes.time_slots.forEach(async(movietime) =>{
                                        if(movietime.start_time == cartMovie.start_time && movietime.end_time == cartMovie.end_time){
                                            timeid = movietime.timeID
                                            return;
                                        }
                                    })
                                })
                                movieItem = await movie_times.findOne({where: {movieID: movie.movieID, timeID: timeid}},{transaction: t2})
                                var newQuantity = movieItem.quantity - cartMovie.quantity
                                if(newQuantity < 0){
                                    flag = false;
                                    throw "No More Slots"
                                }
                                else{
                                    await movie_times.update({quantity: newQuantity}, 
                                        {where: {movieID: movie.movieID, timeID: timeid}},{transaction: t2})
                                    await transactions.create({
                                        "title": movie.title,
                                        "date": Date.now(),
                                        "start_time": cartMovie.start_time,
                                        "end_time": cartMovie.end_time,
                                        "individual_price": movie.price,
                                        "quantity_purchased": cartMovie.quantity,
                                        "total_price": totalPrice,
                                        "credit_card": "**** ".repeat(3) + creditCardNumber.substr(creditCardNumber.length - 4),
                                        "date_purchased": Date.now(),
                                        "userID": user.userID
                                    },{transaction: t2})
                                    await cart_movies.destroy({where: {id :cartMovie.id}},{transaction: t2})

                                    if(process.env.NODE_ENV == "development"){
                                        devLogger.info(`User ${user.userID} successfully checked out from their cart: recorded as transaction ${transactions.transactionID}`)
                                    }else{
                                        userActivityLogger.info(`User ${user.userID} successfully checked out from their cart: recorded as transaction ${transactions.transactionID}`)
                                        transactionLogger.info(`Recorded transaction from user ${user.userID}: ${transactions.transactionID}`)
                                    }

                                }
                            }catch(error){
                                if(process.env.NODE_ENV == "development"){
                                    devLogger.error(`Something went wrong with the transaction: ${error.stack}`)
                                }
                            }
                        })
                        await Promise.all(userCartMoviesPromises)
                        return flag;
                    })
                })
                if (result){
                    res.redirect("/account")
                }
                else{
                    throw "Error occurred in PostPayment"
                }
            }
            else{
                throw "Failed Credit Card Validation"
            }
        }catch(error){
            if(process.env.NODE_ENV == "development"){
                devLogger.error(`Something went wrong with the transaction: ${error.stack}`)
            }
            res.status(500).redirect('/error');
        }
    }
    
}

module.exports = cart_controller