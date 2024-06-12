const {movies} = require('../models/')

const movie_controller = {
    getMovies: async function(req, res) {   
        const allMovies = await movies.findAll();
        res.render('index', {layout: '/layouts/layout.hbs', movie:allMovies, title: "Main - Filmworks"}) // move to controller next time when db is functioning
    },
}

module.exports = movie_controller