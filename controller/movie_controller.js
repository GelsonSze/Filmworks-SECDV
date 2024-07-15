const {movies, users, admins, reviews} = require('../models/')

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

        
            //adjust this depending on whether admin or user is accessing the page
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
            //means there was no movie found given that information
            //redirect to error page
            if(process.env.NODE_ENV == "development"){
                console.error(`movie with id ${req.params.movieID} not found`);
            }
            
            res.status(500).redirect('/error');
        }
        
        
    }, 

    findMovie: async function(req, res){
        //get movie title
        var movie_name = req.body.search
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

            //get and add details of review and place it into the review database
            //check first if user exists
            if (user){
                //get info from the indicated places
                //add it to reviews db

                
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
                    title: movie.title + " - Filmworks"
                    // review: movie.reviews 
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