const {movie} = require('../models/')

const movie_controller = {
    getMovies: async function(req, res) {
        const movies = await movie.findAll();
        res.render('index', {layout: '/layouts/layout.hbs', movie:movies, title: "Main - Filmworks"}) // move to controller next time when db is functioning
    },
}

module.exports = movie_controller