/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const mongoose = require('mongoose');

// items in cart per user 
// will only be deleted when it is either removed manually, checked-out, or the user deleted his account
const CartSchema = new mongoose.Schema({

    email: {type:String},           //  to identity the owner of cart
    movie_id: {type: String},
    movie_date: {type: Date},
    movie_name: {type: String},     
    movie_img: {type: String},
    movie_timeSlot: {type: String},      
    price: {type: Number},          
    quantity: {type: Number},
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;