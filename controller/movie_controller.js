const { ResultWithContext } = require('express-validator/src/chain');
const {movies, users, admins, reviews, time_slots, movie_reviews, movie_times} = require('../models/')
const { v4: uuidv4 } = require('uuid');

const movie_controller = {
    getMovies: async function(req, res) {   
        if (!req.user){ //if user does not exist redirect to /
            res.redirect('/');
        }else{
            try {
                const allMovies = await movies.findAll();
                //checks if user is admin or not 
                const userInfo = await users.findOne({ where: { emailAddress: req.user.username }}, function (result){
                })
                const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }}, function (result){
                })
                
                //page rendered depends on if account exists as either admin or user
                if (userInfo){
                    res.render('index',{layout: '/layouts/layout.hbs',
                        movie:allMovies, 
                        title: "Main - Filmworks"
                    });
                }else if(adminInfo){
                    res.render('index',{layout: '/layouts/layout_admin.hbs',
                        movie: allMovies,
                        title: "Main - Filmworks"
                    });
                }else{
                    //error showing account details

                    if(process.env.NODE_ENV == "development"){
                        console.error(error);
                    }
                    
                    res.status(500).json({ message: 'An Error Occurred' });
                }
            } catch (error) {
                if(process.env.NODE_ENV == "development"){
                    console.error(error);
                }

                res.status(500).json({ message: 'An Error Occurred' });
            }
        }

    },

    redirectToMoviePage: async function(req, res) {  
        //code not working and displaying page as intended 
        console.log("MOVIE INFORMATION")
        console.log(req.params.movieID)
       
        const movie = await movies.findOne({ where: { movieID:  req.params.movieID } });
        // const review = await reviews.findAll({where: {}})
        // const movie = await movies.findOne({ where: { id:  1} });
        if (movie){
            //insert code for adding timestamp of website
            console.log("MOVIE DETAILS")
            console.log(movie)

            const movieReviews = await movie_reviews.findAll({
                attributes: ['reviewID'],
                where: {movieID: req.params.movieID}
            })

            const reviewIDs = movieReviews.map(review => review.reviewID);
        
            const allReviews = await reviews.findAll({where: {reviewID: reviewIDs}})
        
            //adjust this depending on whether admin or user is accessing the page
            res.render('movie', {layout: '/layouts/layout.hbs', 
                m_id: movie.movieID,
                m_trailer: movie.trailer,
                m_name: movie.title,
                m_image: movie.image,
                m_cast: movie.starring,
                m_synopsis: movie.synopsis,
                timeSlotJQ: "outputJQ",
                title: movie.title + " - Filmworks",
                review: allReviews
                //idk how we will handle this for now but i will just leave design of webpage muna
            });
        }else{
            //means there was no movie found given that information
            //redirect to error page
            if(process.env.NODE_ENV == "development"){
                console.error(`movie with id ${req.params.movieID} not found`);
            }
            
            res.status(500).redirect('/error');
        }
        
        
    }, 

    getAddMovies: async function(req, res){
        //get the page for adding movies
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //after checking if user is admin, display page to be rendered
            res.render('movie-details', {layout: '/layouts/layout_admin.hbs'});
        }
    }, 

    addMovie: async function(req, res){
        //render page for adding movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //get timeslots list from db
            const timeslots = await time_slots.findAll()

            res.render('add-movie-db', {layout: '/layouts/layout_admin.hbs', 
                time: timeslots
            });
        }
    },

    postaddMovie: async function(req, res){
        //check contents of each field in the form
        //redirect to main page and show the new movie 
        const wordsRegex = /^[a-zA-Z0-9]+$/
        const trailerRegex= /^https:\/\/youtu\.be\/[^&<>#"\\]*$/
        const numberRegex = /^[0-9]+$/
        
        if (!wordsRegex.test(req.body.movie_title) || !wordsRegex.test(req.body.movie_cast) || !wordsRegex.test(req.body.movie_synopsis)) {
            var info = {
                error:'Invalid text format'
            }
            res.render('error',{layout: '/layouts/layout_admin.hbs', 
                error: info.error,
                title: 'Error - Filmworks'
            });
            return;
        }

        if (!trailerRegex.test(req.body.movie_trailer)) {
            var info = {
                error:'Invalid URL for trailer'
            }
            res.render('error',{layout: '/layouts/layout_admin.hbs', 
                error: info.error,
                title: 'Error - Filmworks'
            });
            return;
        }
        
        if (!numberRegex.test(req.body.movie_price) || !numberRegex.test(req.body.movie_quantity)) {
            var info = {
                error:'Invalid input for ticket quantity and/or price'
            }
            res.render('error',{layout: '/layouts/layout_admin.hbs', 
                error: info.error,
                title: 'Error - Filmworks'
            });
            return;
        }

        if (req.file == undefined) {
            var info = {
                error:'No file uploaded'
            }
            res.render('error',{layout: '/layouts/layout_admin.hbs', 
                error: info.error,
                title: 'Error - Filmworks'
            });
            return;
        }

        var newMovie = {
            title: req.body.movie_title,
            starring: req.body.movie_cast,
            synopsis: req.body.movie_synopsis,
            trailer: req.body.movie_trailer,
            price: req.body.movie_price,
            quantity: req.body.movie_quantity,
            // start_date: 
            // end_date:
        }
        
        newMovie.image = '../uploads/movies/' + req.file.filename

        //add the newly created movie to the db
        const insertMovie = await movies.create({
            title: newMovie.title,
            starring: newMovie.starring,
            synopsis: newMovie.synopsis,
            trailer:newMovie.trailer,
            price: newMovie.price,
            quantity: newMovie.quantity,
            // start_date: 
            // end_date:
        })
    },

    getDeleteMovie: async function(req, res){
        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //after checking if user is admin, display page to be rendered
            res.render('delete-movie-db', {layout: '/layouts/layout_admin.hbs'});
        }
    },

    postDeleteMovie: async function(req, res){
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                console.log("MOVIE TO BE DELETED")
                console.log(req.body.movie_title)
                const movie_title = req.body.movie_title.toUpperCase()
                
                //given movie title find movie
                const movie_delete = await movies.findOne({ where: { title: movie_title }})
                //replace above with this
                // const movie_delete = await movies.destroy({ where: { title: movie_title }})



                // const movieTimes = await movie_times.destroy({ where: { movieID: movie_delete.movieID }})
    
                console.log("CHECKER FOR IF MOVIE AND TIME WERE FOUND")
                console.log(movie_delete)
                // console.log(time_delete)

                const allMovies = await movies.findAll(); //display movies that were not deleted
                res.render('index',{layout: '/layouts/layout_admin.hbs',
                    movie: allMovies,
                    title: "Main - Filmworks"
                });
            }catch(error){
                //show error information
                if(process.env.NODE_ENV == "development"){
                    console.error(error);
                }

                res.status(500).json({ message: 'An Error Occurred' });
            }



        }

    },

    getUpdateMovie: async function(req, res){
        //display first the get delete movie page except that user inputs the movie ID of page one wishes to update

        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //after checking if user is admin, display page to be rendered
            res.render('update-movie-db', {layout: '/layouts/layout_admin.hbs'});
        }
    },

    updateMovieDetails: async function(req, res){
        //after submitting it, redirect to this page and check 
        //display the create page except the parameters are the ones from the db
        //user has option to 
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                console.log("MOVIE TO BE UPDATED")
                console.log(req.body.movie_title)
                const movie_title = req.body.movie_title.toUpperCase()
                
                //given movie title find movie
                const movie_update = await movies.findOne({ where: { title: movie_title }})
                const timeslots = await time_slots.findAll()



                //replace above with this
                // const movie_delete = await movies.destroy({ where: { title: movie_title }})


                //get the movietimes and information needed
                //error with this code to be fixed later once the time slots db has been populated
                // const movieTimes = await movie_times.findAll({ where: { movieID: movie_delete.movieID }})
                // const timeIDs = movieTimes.map(entry => entry.timeID);
                // const time_delete = await time_slots.findOne({ where: { timeID: timeIDs }})
    
                console.log("CHECKER FOR IF MOVIE AND TIME WERE FOUND")
                console.log(movie_update.title)
                res.render('update-movie-details', {layout: '/layouts/layout_admin.hbs', 
                    movie_title: movie_update.title,
                    movie_cast: movie_update.starring,
                    movie_synopsis: movie_update.synopsis,
                    movie_trailer: movie_update.trailer,
                    movie_price: movie_update.price,
                    movie_quantity: movie_update.quantity, 
                    time: timeslots
                });

            }catch(error){
                //show error information
                if(process.env.NODE_ENV == "development"){
                    console.error(error);
                }

                res.status(500).json({ message: 'An Error Occurred' });
            }



        }

    },

    postUpdateMovieDetails: async function(req, res){
        //check information in the form
        //redirect to main page of website
    },

    getAddTimeSlot: async function(req, res){

        //selects the movie who needs more timeslots
        //display first the get delete movie page except that user inputs the movie ID of page one wishes to update

        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){

            const timeslots = await time_slots.findAll()
            if (timeslots){
                //after checking if user is admin, display page to be rendered and checking if timeslots are available
                res.render('add-timeslot', {layout: '/layouts/layout_admin.hbs', 
                    time: timeslots
                });
            }

        }
    },

    postAddTimeSlot: async function(req, res){
        //redirects to the page which shows the timeslot options to be added for the movie

        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                console.log("MOVIE TO BE UPDATED")
                console.log(req.body.movie_title)
                const [start_time, end_time] = req.body.time_slots.split(' - ');
                const movie_title = req.body.movie_title.toUpperCase()
                
                //given movie title find movie
                const movie_update = await movies.findOne({ where: { title: movie_title }})
                
                //means movie exists
                if (movie_update){
                    const timeslot = await time_slots.findOne({ where: { 
                        start_time: start_time,
                        end_time: end_time
                    }})
                    
                    console.log("TESTING RESULTS OBTAINED FROM TIMESLOT")
                    console.log(timeslot)
                   
                    //double check this part since it is not working
                    // const addedTimeslot = movie_times.create({
                    //     movieID: movie_update.movieID,  //get the ID of the movie 
                    //     timeID: timeslot.timeID
                    // })
                    
                    // console.log("ADDING TO MOVIE TIMES DB")
                    // console.log(addedTimeslot)
    
                    //maybe show a success message??
                    res.redirect('/')
                }else{
                    //movie doesnt exist so error happens
                    if(process.env.NODE_ENV == "development"){
                        console.error(error);
                    }

                    res.status(500).json({ message: 'An Error Occurred' });
                }


            }catch(error){
                //show error information
                if(process.env.NODE_ENV == "development"){
                    console.error(error);
                }

                res.status(500).json({ message: 'An Error Occurred' });
            }
        }
    },



    findMovie: async function(req, res){
        //get movie title
        const movie_name = req.body.search
        movie_name = movie_name.toUpperCase()

        //check movie if it exists
        const movie = await movies.findOne({ where: {title: movie_name }})

        if (movie){
            res.render('movie', {layout: '/layouts/layout.hbs', 
                m_id: movie.movieID,
                m_trailer: movie.trailer,
                m_name: movie.title,
                m_image: movie.image,
                m_cast: movie.starring,
                m_synopsis: movie.synopsis,
                timeSlotJQ: "outputJQ",
                title: movie.title + " - Filmworks"
                // review: movie.reviews 
                //idk how we will handle this for now but i will just leave design of webpage muna
            });
        }else{
            if(process.env.NODE_ENV == "development"){
                console.error(`movie with name ${movie_name} not found`);
            }
            
            res.status(500).redirect('/error');
        }

    }, 

    addReview: async function(req, res) { 
        //function for adding reviews for a specific movie
        //check if movie ID exists 

        console.log("MOVIE INFORMATION")
        console.log(req.params.movieID)
        const movie = await movies.findOne({where: {movieID: req.params.movieID}})
        console.log("MOVIE DETAILS")
        console.log(movie)
        //if movie ID exists, means we can post a review like normal
        if (movie){
            console.log("MOVIE EXISTS")
            //check if user exists first
            const user = await users.findOne({where: {emailAddress: req.session.passport.user.username}})
            console.log("USER DETAILS")
            console.log(user)
            console.log("req.body")
            console.log(req.body)

            //get and add details of review and place it into the review database
            //check first if user exists
            if (user){
                //get info from the indicated places
                //add it to reviews db
                const id = uuidv4()

                const newReview = await reviews.create({
                    reviewID: id,
                    rating: req.body.rating,
                    description: req.body.newReview,
                    reviewer: user.fullName,
                    userID: user.userID
                })

                const newMovieReview = await movie_reviews.create({
                    movieID: req.params.movieID,
                    reviewID: id
                })

                const movieReviews = await movie_reviews.findAll({
                    attributes: ['reviewID'],
                    where: {movieID: req.params.movieID}
                })

                console.log("movieReviews")
                console.log(movieReviews)

                const reviewIDs = movieReviews.map(review => review.reviewID);
            
                const allReviews = await reviews.findAll({where: {reviewID: reviewIDs}})

                console.log("allReviews")
                console.log(allReviews)
                
                //after adding the review to the db
                //render the movie page again with the updated review
                //get the reviews given the movieID from the DB
                res.render('movie', {layout: '/layouts/layout.hbs', 
                    m_id: movie.movieID,
                    m_trailer: movie.trailer,
                    m_name: movie.title,
                    m_image: movie.image,
                    m_cast: movie.starring,
                    m_synopsis: movie.synopsis,
                    timeSlotJQ: "outputJQ",
                    title: movie.title + " - Filmworks",
                    review: allReviews 
                    //idk how we will handle this for now but i will just leave design of webpage muna
                });
            }
            else{
                //error
                if(process.env.NODE_ENV == "development"){
                    console.error(error);
                }
                
                res.status(500).json({ message: 'An Error Occurred' });
            }

        }else{
            //error occured
            if(process.env.NODE_ENV == "development"){
                console.error(`movie with id ${req.params.movieID} not found`);
            }
            
            res.status(500).redirect('/error');
        }

    }
}

module.exports = movie_controller