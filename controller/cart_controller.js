const {users, admins, sessions, bannedIPs} = require('../models/')
const {movies} = require('../models/')

const db = require('../models/index.js')
const cart_controller = {
    getCart: async function(req, res) {
        //means no user was logged in
        if (!req.user) { 
            res.redirect('/')
        }
        else
            //insert code for getting cart info of user
            res.render('cart', {layout: '/layouts/account.hbs', item: "result", title: "Cart - Filmworks"});
    },

    addMovieToCart: async function(req, res){
        //modify this to get the ID of the movie clicked by user or title and etc
        const movie = await movies.findOne({where: {id: 1}})

        if (movie) { //means movie was found
            //check user current movies and if id already exists prior, update cart and increase ticket count
            //else just add regularly to cart
        }
        else {
            //movie selection does not exist and has errors
            //display error page
        }
        
    },

    deleteMovieFromCart: async function(req, res){
        //delete one copy of movie from cart or ticket db
    },

    // opens payment page
    getPayment: function(req,res){
        if (!req.user) //user info is not available
            res.redirect('/')
        else
            res.render('payment', {layout: '/layouts/layout.hbs', title: "Payment - Filmworks"});
    },

    // passes the data in payment page
    postPayment: async function(req,res){

        console.log("Entered payment")
        console.log(req.body)

        const cardNumRegex = /^[0-9]{16}$/g
        const nameRegex = /^[a-zA-Z\s]+$/
        const cardExpireRegex = "^\d{4}\/\d{2}\$"
        const cvvRegex = /^[0-9]{3}$/g
        
        // //check if exp date is not current date
        // var exp = new Date(Date.parse(req.body.expiration));
        // var current = new Date(); //current date
        // if (exp.getTime() > current.getTime() && isNaN(req.body.cardnum) == false) { //exp date is newer or later 

        //     db.findMany(Cart, {email: req.session.email}, null, function (result){
        //         // adds the details of the movie in the cart checked out to the user
        //         for (i = 0; i < result.length; i++){
        //             db.updateOne(User, {email: req.session.email}, {$push: {movieDetails : {id: result[i].movie_id, date: result[i].movie_date, timeslot: result[i].movie_timeSlot, quantity: result[i].quantity, m_image: result[i].movie_img }}}, function (updating){});
        //         }

        //         // reduces the number of tickets ordered by the user from the databse
        //         for (j = 0; j < result.length; j++){
        //             var order = -Math.abs(result[j].quantity);
        //             db.updateOne(Movie, {m_id: result[j].movie_id, "ticket.date": result[j].movie_date}, {$inc:{"ticket.$.quantity": order}}, function (value){});
        //         }
        //     });
            
        //     // deletes the cart of the user
            
        //     res.redirect('/account');
        // }
        // else {
        //     res.redirect('/main');
        // }

        
    }


    
}

module.exports = cart_controller