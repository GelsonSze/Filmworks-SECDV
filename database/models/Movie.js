/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

const MovieSchema = new mongoose.Schema({
    m_id: {type: String, unique: true},
    m_image: {type: String},
    m_name: {type: String},
    m_cast: {type: String},
    m_synopsis: {type: String},
    m_trailer: {type: String},
    m_price: {type: String},
    ticket: [{
        date: {type: Date},
        quantity: {type: Number}
    }]
});

const Movie = mongoose.model('Movie', MovieSchema);


module.exports = Movie;