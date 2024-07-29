const { ResultWithContext } = require('express-validator/src/chain');
const {movies, users, admins, reviews, time_slots, movie_reviews, movie_times} = require('../models/')
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

const movie_controller = {
    getMovies: async function(req, res) {   
        if (!req.user){ //if user does not exist redirect to /
            res.redirect('/');
        }else{
            try {
                const allMovies = await movies.findAll();
                //checks if user is admin or not 
                const userInfo = await users.findOne({ where: { emailAddress: req.user.username }, attributes: ['userID']}, function (result){
                })
                const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']}, function (result){
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
            const timeslots = await movie_times.findAll({ where: { movieID: req.params.movieID } });
        
            if (timeslots.length > 0) {
                // Means movie has existing timeslot
                console.log("TIMESLOT EXISTS");
                const timeIDs = timeslots.map(timeslot => timeslot.timeID);
                const movieTime = await time_slots.findAll({ where: { timeID: timeIDs } });
                res.render('movie', {layout: '/layouts/layout.hbs', 
                    m_id: movie.movieID,
                    m_trailer: movie.trailer,
                    m_name: movie.title,
                    m_image: movie.image,
                    m_cast: movie.starring,
                    m_synopsis: movie.synopsis,
                    timeSlotJQ: movieTime,
                    title: movie.title + " - Filmworks",
                    review: allReviews

                });
            }else{
                res.render('movie', {layout: '/layouts/layout.hbs', 
                    m_id: movie.movieID,
                    m_trailer: movie.trailer,
                    m_name: movie.title,
                    m_image: movie.image,
                    m_cast: movie.starring,
                    m_synopsis: movie.synopsis,
                    timeSlotJQ: "movieTime",
                    title: movie.title + " - Filmworks",
                    review: allReviews

                });
            }
        
            //adjust this depending on whether admin or user is accessing the page

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
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //after checking if user is admin, display page to be rendered
            res.render('movie-details', {layout: '/layouts/layout_admin.hbs'});
        }
    }, 

    addMovie: async function(req, res){
        //render page for adding movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
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

        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){

            console.log("USER IS ADMIN")
            
            const wordsRegex = /^[a-zA-Z0-9 ',.!?()_-]*$/
            const trailerRegex= /^https:\/\/youtu\.be\/[^&<>#"\\]*$/
            const numberRegex = /^[0-9]+$/
            const timeSlotRegex = /^(\d{2}:\d{2} (?:AM|PM) - \d{2}:\d{2} (?:AM|PM))$/;

            const sanitizedTitle = sanitizeHtml(req.body.movie_title);
            const sanitizedCast = sanitizeHtml(req.body.movie_cast);
            const sanitizedSynopsis = sanitizeHtml(req.body.movie_synopsis);
            const sanitizedTrailer = sanitizeHtml(req.body.movie_trailer);
            const sanitizedPrice = sanitizeHtml(req.body.movie_price);
            const sanitizedQuantity = sanitizeHtml(req.body.movie_quantity);
            const sanitizedStartDate = sanitizeHtml(req.body.start_date);
            const sanitizedEndDate = sanitizeHtml(req.body.end_date);
            const sanitizedTimeSlots = sanitizeHtml(req.body.time_slots);

            if (!wordsRegex.test(sanitizedTitle) || !wordsRegex.test(sanitizedCast) || !wordsRegex.test(sanitizedSynopsis)) {
                var info = {
                    error:'Invalid text format'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }

            if (!trailerRegex.test(sanitizedTrailer)) {
                var info = {
                    error:'Invalid URL for trailer'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }
            
            if (!numberRegex.test(sanitizedPrice) || !numberRegex.test(sanitizedQuantity)) {
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

            //check the input for start date and end date
            const start = new Date(sanitizedStartDate);
            const end = new Date(sanitizedEndDate);

            console.log("END AND START DATE INFO")
            console.log(end)
            console.log(start)
            
            // Check if dates are not empty 
            if (!start || !end) {
                var info = {
                    error:'The application has encountered an unknown error.'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }
            
            // Check if end date is not earlier than start date

            if (end < start) {
                //if end is less than start check if they are equal
                //if not equal error
                if(!(start.getFullYear() === end.getFullYear() &&
                start.getMonth() === end.getMonth() &&
                start.getDate() === end.getDate())){
                    //date is not the same so error
                    var info = {
                        error:'Date input is not valid'
                    }
                    res.render('error',{layout: '/layouts/layout_admin.hbs', 
                        error: info.error,
                        title: 'Error - Filmworks'
                    });
                    return;
                }
            }


            if (!timeSlotRegex.test(sanitizedTimeSlots)) {
                console.log("REGEX DIDNT PASS")
                // Handle invalid time slots format
                    //date is not the same so error
                var info = {
                    error:'Timeslot input is not valid'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }
            //should only push through once the timeslot was valid
            const [start_time, end_time] = sanitizedTimeSlots.split(' - ')
            const timeslot = await time_slots.findOne({ where: { 
                start_time: start_time,
                end_time: end_time
            }})
            
            if (!timeslot){
                //means timeslot is not valid timeslot chosen
                var info = {
                    error:'The application has encountered an unknown error.'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }

            var newMovie = {
                title: sanitizedTitle.toUpperCase(),
                starring: sanitizedCast.toUpperCase(),
                synopsis: sanitizedSynopsis,
                trailer: sanitizedTrailer,
                price: sanitizedPrice,
                quantity: sanitizedQuantity,
                start_date: sanitizedStartDate,
                end_date: sanitizedEndDate
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
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                image: newMovie.image
            })

            //check if timeslot is part of movietimes db already given movieID, should be impossible
            //but to be safe lang
            const checkDupe = await movie_times.findOne({ where:{
                movieID: insertMovie.movieID,  //get the ID of the movie 
                timeID: timeslot.timeID
            }})

            if (checkDupe){
                //means theres a duplicate already \
                console.log(checkDupe)
                if(process.env.NODE_ENV == "development"){
                    console.error(`The application has encountered an unknown error.`);
                }
                
                res.status(500).redirect('/error');
            }else{

                //adds the new timeslot to movie times db
                const addedTimeslot = await movie_times.create({
                    movieID: insertMovie.movieID,  
                    timeID: timeslot.timeID   
                });
                
                console.log("ADDING TO MOVIE TIMES DB")
                console.log(addedTimeslot)
                //means creation of movie and timeslot was successful
                if (insertMovie && addedTimeslot){
                    //movie was successfully created
                    res.redirect('/')
                }else{
                    if(process.env.NODE_ENV == "development"){
                        console.error(`The application has encountered an unknown error.`);
                    }
                    
                    res.status(500).redirect('/error');
                }
            }

            

        }
    },

    getDeleteMovie: async function(req, res){
        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //after checking if user is admin, display page to be rendered
            res.render('delete-movie-db', {layout: '/layouts/layout_admin.hbs'});
        }
    },

    listMoviesDelete: async function(req, res){
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                const movie_name = sanitizeHtml(req.body.movie_title)
                const movie_title = movie_name
                
                //given movie title find movie
                const movie_delete = await movies.findAll({ where: { title: movie_title }})
                //replace above with this
                // const movie_delete = await movies.destroy({ where: { title: movie_title }})

                // const movieTimes = await movie_times.destroy({ where: { movieID: movie_delete.movieID }})
    
                console.log("CHECKER FOR IF MOVIE AND TIME WERE FOUND")
                console.log(movie_delete)
                // console.log(time_delete)

                const allMovies = await movies.findAll(); //display movies that were not deleted
                res.render('delete-movies-page',{layout: '/layouts/layout_admin.hbs',
                    movie: movie_delete,
                    title: "Movies to be deleted - Filmworks"
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

    postDeleteMovie: async function(req, res){
        console.log("ENTERED THIS")
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                console.log("MOVIE TO BE DELETED")
                console.log(req.body.movieID)

                const movie_ID = sanitizeHtml(req.body.movieID)
                
                //given movie ID find specific movie
                const movie_find = await movies.findOne({ where: { movieID: movie_ID }})
                if (movie_find){
                    //movie was found
                    const removeTime = await movie_times.destroy({ where: { movieID:movie_ID }})

                    //replace above with this
                    const movie_delete = await movies.destroy({ where: { movieID: movie_ID }})
    
                    // const movieTimes = await movie_times.destroy({ where: { movieID: movie_delete.movieID }})
                    if (movie_delete && removeTime){
                        //means movie was deleted
                        res.redirect('/')
                    }else{
                        if(process.env.NODE_ENV == "development"){
                            console.error(error);
                        }
        
                        res.status(500).json({ message: 'An Error Occurred' });
                    }
                }else{
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

    getUpdateMovie: async function(req, res){
        //display first the get delete movie page except that user inputs the movie ID of page one wishes to update

        //render page for updating movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //after checking if user is admin, display page to be rendered
            res.render('update-movie-db', {layout: '/layouts/layout_admin.hbs'});
        }
    },

    listMoviesUpdate: async function(req, res){
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                const movie_name = sanitizeHtml(req.body.movie_title)
                const movie_title = movie_name.toUpperCase()
                
                //given movie title find movie
                const movie_update = await movies.findAll({ where: { title: movie_title }})
                //replace above with this
                // const movie_delete = await movies.destroy({ where: { title: movie_title }})



                // const movieTimes = await movie_times.destroy({ where: { movieID: movie_delete.movieID }})
    
                console.log("CHECKER FOR IF MOVIE AND TIME WERE FOUND")
                console.log(movie_update)

                //shows all movies with the same title
                res.render('update-movies-page',{layout: '/layouts/layout_admin.hbs',
                    movie: movie_update,
                    title: "Movies to be updated - Filmworks"
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

    updateMovieDetails: async function(req, res){
        try {
            // Assuming req.user.username contains the email address of the admin
            const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID'] });
        
            // means user is admin
            if (adminInfo) {
                // Check contents of each field in the form
                // Redirect to the main page and show the updated list of movies
        
                // Given movie title find all movies with the same title
                const movie_ID = sanitizeHtml(req.body.movieID)
                const movie_update = await movies.findOne({ where: { movieID: movie_ID } });
        
                let movieTime = "";
                let originalTimeslots = "";
        
                if (movie_update) {
                    // Gets the timeslot ID of all with the same movieID
                    const timeslots = await movie_times.findAll({ where: { movieID: movie_update.movieID } });
        
                    if (timeslots.length > 0) {
                        // Means movie has existing timeslot
                        console.log("TIMESLOT EXISTS");
                        const timeIDs = timeslots.map(timeslot => timeslot.timeID);
                        movieTime = await time_slots.findAll({ where: { timeID: timeIDs } });
                        originalTimeslots = await time_slots.findAll();
                    }
        
                    res.render('update-movie-details', {
                        movieID: movie_update.movieID,
                        layout: '/layouts/layout_admin.hbs',
                        movie_title: movie_update.title,
                        movie_cast: movie_update.starring,
                        movie_synopsis: movie_update.synopsis,
                        movie_trailer: movie_update.trailer,
                        movie_price: movie_update.price,
                        movie_quantity: movie_update.quantity,
                        movieTime: movieTime, // Refers to the timeslots already existing for that movie
                        time: originalTimeslots,
                        start_date: movie_update.start_date,
                        end_date: movie_update.end_date
                    });
                } else {
                    // If the movie is not found
                    res.status(404).json({ message: 'Movie not found' });
                }
            } else {
                // If the user is not an admin
                res.status(403).json({ message: 'Unauthorized' });
            }
        } catch (error) {
            // Show error information
            if (process.env.NODE_ENV === "development") {
                console.error(error);
            }
            res.status(500).json({ message: 'An Error Occurred' });
        }
        

    },

    postUpdateMovieDetails: async function(req, res){
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){

            console.log("USER IS ADMIN")
            
            const wordsRegex = /^[a-zA-Z0-9 ,'.!?()_-]*$/
            const trailerRegex= /^https:\/\/youtu\.be\/[^&<>#"\\]*$/
            const numberRegex = /^[0-9]+$/
            const timeSlotRegex = /^(\d{2}:\d{2} (?:AM|PM) - \d{2}:\d{2} (?:AM|PM))$/;

            const sanitizedTitle = sanitizeHtml(req.body.movie_title)
            const sanitizedCast = sanitizeHtml(req.body.movie_cast)
            const sanitizedSynopsis = sanitizeHtml(req.body.movie_synopsis)
            const sanitizedTrailer = sanitizeHtml(req.body.movie_trailer)
            const sanitizedPrice = sanitizeHtml(req.body.movie_price)
            const sanitizedQuantity = sanitizeHtml(req.body.movie_quantity)
            const sanitizedStartDate = sanitizeHtml(req.body.start_date)
            const sanitizedEndDate = sanitizeHtml(req.body.end_date)
            const sanitizedTimeSlots = sanitizeHtml(req.body.time_slots)
            const sanitizedMovieTime = sanitizeHtml(req.body.movie_time)
            if (!wordsRegex.test(sanitizedTitle) || !wordsRegex.test(sanitizedCast) || !wordsRegex.test(sanitizedSynopsis)) {
                var info = {
                    error:'Invalid text format'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }

            if (!trailerRegex.test(sanitizedTrailer)) {
                var info = {
                    error:'Invalid URL for trailer'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }
            
            if (!numberRegex.test(sanitizedPrice) || !numberRegex.test(sanitizedQuantity)) {
                var info = {
                    error:'Invalid input for ticket quantity and/or price'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }

            //check the input for start date and end date
            const start = new Date(sanitizedStartDate);
            const end = new Date(sanitizedEndDate);

            console.log("END AND START DATE INFO")
            console.log(end)
            console.log(start)
            
            // Check if dates are not empty 
            if (!start || !end) {
                var info = {
                    error:'Date input is not valid'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }
            
            // Check if end date is not earlier than start date

            if (end < start) {
                //if end is less than start check if they are equal
                //if not equal error
                if(!(start.getFullYear() === end.getFullYear() &&
                start.getMonth() === end.getMonth() &&
                start.getDate() === end.getDate())){
                    //date is not the same so error
                    var info = {
                        error:'Date input is not valid'
                    }
                    res.render('error',{layout: '/layouts/layout_admin.hbs', 
                        error: info.error,
                        title: 'Error - Filmworks'
                    });
                    return;
                }
            }
            if (!timeSlotRegex.test(sanitizedTimeSlots) || !timeSlotRegex.test(sanitizedMovieTime)) {
                // Handle invalid time slots format
                    //date is not the same so error
                var info = {
                    error:'Timeslot input is not valid'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }

            //should only push through once the timeslot was valid
            const [start_time_new, end_time_new] = sanitizedTimeSlots.split(' - ')
            const [start_time_old, end_time_old] = sanitizedMovieTime.split(' - ') 
            //the new is used since thats the one we are attempting to update
            const timeslot = await time_slots.findOne({ where: { 
                start_time: start_time_new,
                end_time: end_time_new
            }})

            const originalTime = await time_slots.findOne({ where: { 
                start_time: start_time_old,
                end_time: end_time_old
            }})

            const check = await movie_times.findOne({ where: { 
                movieID: req.body.movieID,
                timeID: originalTime.timeID
            }})


            //means timeslot was not found and movie times does not have given time chosen
            if (!check || !timeslot){
                console.log("TIMESLOT NOT FOUND")
                //means timeslot for movie already exists or input is not valid
                var info = {
                    error:'Timeslot input is not valid'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }

            console.log("ALL INPUTS WERE OK")

            var newMovie = {
                title: sanitizedTitle.toUpperCase(),
                starring: sanitizedCast.toUpperCase(),
                synopsis: sanitizedSynopsis,
                trailer: sanitizedTrailer,
                price: sanitizedPrice,
                quantity: sanitizedQuantity,
                start_date: sanitizedStartDate,
                end_date: sanitizedEndDate
            }


            //check if timeslot is part of movietimes db already given movieID
            const checkDupe = await movie_times.findOne({ where:{
                movieID: req.body.movieID,  //get the ID of the movie 
                timeID: timeslot.timeID
            }})

            if (checkDupe){
                //means theres a duplicate already \
                console.log("DUPLICATE TIMESLOT")
                var info = {
                    error:'Timeslot input is not valid'
                }
                res.render('error',{layout: '/layouts/layout_admin.hbs', 
                    error: info.error,
                    title: 'Error - Filmworks'
                });
                return;
            }else{
                console.log("NO DUPLICATE")

                //adds the new timeslot to movie times db
                const addedTimeslot = await movie_times.create({
                    movieID: req.body.movieID,  
                    timeID: timeslot.timeID   
                });

                const deleteTimeslot = await movie_times.destroy({ where:{
                    movieID: req.body.movieID,  
                    timeID: originalTime.timeID
                }
                });
                
                console.log("ADDING TO MOVIE TIMES DB")
                console.log(addedTimeslot)
                //means creation of movie and timeslot was successful
                if (!addedTimeslot || !deleteTimeslot){
                    //timeslot was not added properly
                    if(process.env.NODE_ENV == "development"){
                        console.error(`error with movie creation`);
                    }
                    
                    res.status(500).redirect('/error');
                }
            }

            if (req.file != undefined){
                //in case user decides to update the filename of user
                newMovie.image = '../uploads/movies/' + req.file.filename
                const updateMovie = await movies.update({ 
                    title: newMovie.title,
                    starring: newMovie.starring,
                    synopsis: newMovie.synopsis,
                    trailer:newMovie.trailer,
                    price: newMovie.price,
                    quantity: newMovie.quantity,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    image: newMovie.image
                }, {where: {movieID: req.body.movieID}})

                if (updateMovie){
                    //movie was successfully updated
                    res.redirect('/')
                }
            }else{
                const updateMovie = await movies.update({ 
                    title: newMovie.title,
                    starring: newMovie.starring,
                    synopsis: newMovie.synopsis,
                    trailer:newMovie.trailer,
                    price: newMovie.price,
                    quantity: newMovie.quantity,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                },{where: {movieID: req.body.movieID}}
                    )

                if (updateMovie){
                    //movie was successfully updated
                    res.redirect('/')
                }
            }
            
        }
    },

    getAddTimeSlot: async function(req, res){

        //selects the movie who needs more timeslots
        //display first the get delete movie page except that user inputs the movie ID of page one wishes to update

        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
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

    listMoviesTime: async function(req, res){
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            try{
                const movie_name = sanitizeHtml(req.body.movie_title)
                const movie_title = movie_name.toUpperCase()
                
                //given movie title find movie
                const movie_all = await movies.findAll({ where: { title: movie_title }})

                res.render('timeslots-page',{layout: '/layouts/layout_admin.hbs',
                    movie: movie_all,
                    title: "Movies - Filmworks"
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

    showTimeSlotOptions: async function(req, res){
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            const movie_ID = sanitizeHtml(req.body.movieID)
            const movie_update = await movies.findOne({ where: { movieID: movie_ID }})
            const timeslots = await time_slots.findAll()
            
            if (movie_update) //means movie exists
            {
                res.render('final-timeslot',{layout: '/layouts/layout_admin.hbs',
                    movieID: req.body.movieID,
                    title: "Movie Timeslot - Filmworks",
                    time: timeslots
                });
            }
        }
    }, 

    postAddTimeSlot: async function(req, res){
        //redirects to the page which shows the timeslot options to be added for the movie

        //render page for deleting movie information
        //check first if user is admin
        const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})
        //means user is admin
        if (adminInfo){
            //check contents of each field in the form
            //redirect to main page and show the updated list of movies
            console.log(req.body.movieID)
            try{
                const sanitizedTimeslots = sanitizeHtml(req.body.time_slots)
                const [start_time, end_time] = sanitizedTimeslots.split(' - ');

                const movie_ID = sanitizeHtml(req.body.movieID)
                //given movie title find movie
                const movie_update = await movies.findOne({ where: { movieID: movie_ID }})
                
                //means movie exists
                if (movie_update){
                    const timeslot = await time_slots.findOne({ where: { 
                        start_time: start_time,
                        end_time: end_time
                    }})

                    const timeslotID = timeslot.timeID
                    const movieInfo = movie_update.movieID

                    
                    console.log("TESTING RESULTS OBTAINED FROM TIMESLOT")
                    console.log(timeslot.timeID)
                    
                    //check first if timeslot is already part of DB
                    const checkDupe = await movie_times.findOne({ where:{
                        movieID: movieInfo,  //get the ID of the movie 
                        timeID: timeslotID
                    }})

                    if (checkDupe){
                        //means theres a duplicate already \
                        console.log(checkDupe)
                        if(process.env.NODE_ENV == "development"){
                            console.error(`duplicate timeslot exists`);
                        }
                        
                        res.status(500).redirect('/error');
                    }else{

                        console.log("INPUT PLACED IN DB")
                        console.log(movieInfo)
                        console.log(timeslotID)


                        const addedTimeslot = await movie_times.create({
                            movieID: movieInfo,  
                            timeID: timeslotID   
                        });
                        
                        console.log("ADDING TO MOVIE TIMES DB")
                        console.log(addedTimeslot)
                        if (addedTimeslot){
                            //means it was added to DB
                            res.redirect('/')
                        }else{
                            if(process.env.NODE_ENV == "development"){
                                console.error('timeslot not added properly');
                            }
        
                            res.status(500).json({ message: 'An Error Occurred' });
                        }
                    }
                    

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
        const movie_name = sanitizeHtml(req.body.search.toUpperCase())
        var movieTime

        //check movie if it exists
        const movie = await movies.findOne({ where: {title: movie_name }})
        try {
            const timeslots = await movie_times.findAll({ where: { movieID: movie.movieID } });
            
            if (timeslots.length > 0) {
                const timeIDs = timeslots.map(timeslot => timeslot.timeID);
                movieTime = await time_slots.findAll({ where: { timeID: timeIDs } });
            }
        } catch (error) {
            if(process.env.NODE_ENV == "development"){
                console.error(`The application has encountered an unknown error.`);
            }
            
            res.status(500).redirect('/error');
        }

        const movieReviews = await movie_reviews.findAll({
            attributes: ['reviewID'],
            where: {movieID: movie.movieID}
        })


        const reviewIDs = movieReviews.map(review => review.reviewID);

        const allReviews = await reviews.findAll({where: {reviewID: reviewIDs}})



        if (movie){
            res.render('movie', {layout: '/layouts/layout.hbs', 
                m_id: movie.movieID,
                m_trailer: movie.trailer,
                m_name: movie.title,
                m_image: movie.image,
                m_cast: movie.starring,
                m_synopsis: movie.synopsis,
                timeSlotJQ: movieTime,
                title: movie.title + " - Filmworks",
                review: allReviews 
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

        const movie = await movies.findOne({where: {movieID: req.params.movieID}})
        var movieTime = ""
        
        //if movie ID exists in db, means we can post a review like normal
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

                const newReview = await reviews.create({
                    rating: sanitizeHtml(req.body.rating),
                    description: sanitizeHtml(req.body.newReview),
                    reviewer: user.fullName,
                    userID: user.userID
                })

                const newMovieReview = await movie_reviews.create({
                    movieID: req.params.movieID,
                    reviewID: newReview.reviewID
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

                const timeslots = await movie_times.findAll({ where: { movieID: req.params.movieID } });
                if (timeslots.length > 0) {
                    // Means movie has existing timeslot
                    const timeIDs = timeslots.map(timeslot => timeslot.timeID);
                    movieTime = await time_slots.findAll({ where: { timeID: timeIDs } });

                }
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
                    timeSlotJQ: movieTime,
                    title: movie.title + " - Filmworks",
                    review: allReviews 
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

    },

    deleteReview: async function(req, res) { 
        //function for deleting reviews for a specific movie
        //check if reviewID exists 

        console.log(req.params.reviewID)
        const review = await reviews.findOne({where: {reviewID: req.params.reviewID}})
        console.log("review")
        console.log(review)
        var movieTime = ""
        
        //if reviewID exists in db, means we can delete a review 
        if (review){
            const currentUserID = await users.findOne({
                attributes: ['userID'],
                where: {emailAddress: req.session.passport.user.username}
            })

            // if user deleting review is the user that posted the review exists first
            if (currentUserID.userID === review.userID){
                const movieReview = await movie_reviews.findOne({where: {reviewID: req.params.reviewID}})
                const movie = await movies.findOne({where: {movieID: movieReview.movieID} })
                const movieReviewDestroy = await movie_reviews.destroy({where: {reviewID: req.params.reviewID}})
                const reviewDestroy = await reviews.destroy({where: {reviewID: req.params.reviewID}})

                const movieReviews = await movie_reviews.findAll({
                    attributes: ['reviewID'],
                    where: {movieID: movie.movieID}
                })

                const reviewIDs = movieReviews.map(review => review.reviewID);
            
                const allReviews = await reviews.findAll({where: {reviewID: reviewIDs}})
                

                const timeslots = await movie_times.findAll({ where: { movieID: movieReview.movieID} });
                if (timeslots.length > 0) {
                    // Means movie has existing timeslot
                    const timeIDs = timeslots.map(timeslot => timeslot.timeID);
                    movieTime = await time_slots.findAll({ where: { timeID: timeIDs } });

                }
                //after removing the review from the db
                //render the movie page again with the updated review list
                //get the reviews given the movieID from the DB
                res.render('movie', {layout: '/layouts/layout.hbs', 
                    m_id: movie.movieID,
                    m_trailer: movie.trailer,
                    m_name: movie.title,
                    m_image: movie.image,
                    m_cast: movie.starring,
                    m_synopsis: movie.synopsis,
                    timeSlotJQ: movieTime,
                    title: movie.title + " - Filmworks",
                    review: allReviews 
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
    },

    editReview: async function(req, res) { 
        //function for deleting reviews for a specific movie
        //check if reviewID exists 

        console.log(req.params.reviewID)
        const review = await reviews.findOne({where: {reviewID: req.params.reviewID}})
        console.log("review")
        console.log(review)

        console.log("req.body")
        console.log(req.body)
        console.log("req.params")
        console.log(req.params)
        var movieTime = ""
        //if reviewID exists in db, means we can edit the review 
        if (review){
            const currentUserID = await users.findOne({
                attributes: ['userID'],
                where: {emailAddress: req.session.passport.user.username}
            })

            // if user updating review is the user that posted the review  
            if (currentUserID.userID === review.userID){
                const movieReview = await movie_reviews.findOne({where: {reviewID: req.params.reviewID}})
                const movie = await movies.findOne({where: {movieID: movieReview.movieID} })
                
                review.set({
                    description: sanitizeHtml(req.body.description), 
                    rating: sanitizeHtml(req.body.rating)
                })

                await review.save();

                const movieReviews = await movie_reviews.findAll({
                    attributes: ['reviewID'],
                    where: {movieID: movie.movieID}
                })

                const reviewIDs = movieReviews.map(review => review.reviewID);
            
                const allReviews = await reviews.findAll({where: {reviewID: reviewIDs}})

                const timeslots = await movie_times.findAll({ where: { movieID: movieReview.movieID } });
                if (timeslots.length > 0) {
                    // Means movie has existing timeslot
                    const timeIDs = timeslots.map(timeslot => timeslot.timeID);
                    movieTime = await time_slots.findAll({ where: { timeID: timeIDs } });

                }

                //after removing the review from the db
                //render the movie page again with the updated review list
                //get the reviews given the movieID from the DB
                res.render('movie', {layout: '/layouts/layout.hbs', 
                    m_id: movie.movieID,
                    m_trailer: movie.trailer,
                    m_name: movie.title,
                    m_image: movie.image,
                    m_cast: movie.starring,
                    m_synopsis: movie.synopsis,
                    timeSlotJQ: movieTime,
                    title: movie.title + " - Filmworks",
                    review: allReviews 
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