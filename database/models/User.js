/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    f_name: {type:String, required: true},
    l_name: {type:String,  required: true}, 
    email:{type:String, required: true, unique: true},
    password:{type:String, required: true},
    status:{type:String}, //checkbox value
    image:{type:String},
    movieDetails: [{
        id: {type: String},
        date: {type: Date},
        timeslot: {type: String}, 
        quantity: {type: Number},
        m_image: {type: String}
    }],
});

const User = mongoose.model('User', UserSchema);


module.exports = User;