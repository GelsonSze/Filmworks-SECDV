/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/
   
const db = require('../database/models/db.js');
const Movie = require('../database/models/Movie.js');
const moment = require('moment-timezone');
var PORT = process.env.PORT || 3000;
const movie_controller = {

    // renders the main page with all the movies in the database if person has already logged in
    getMain: function(req, res) {
        if (req.session.email == undefined)
            res.redirect('/')
        else {
            db.findMany(Movie, {}, 'm_name m_image m_id' , function(result){ // 
                var transaction = result;
                res.render('index', {layout: '/layouts/layout.hbs', movie:transaction, title: "Main - Filmworks"});
            });
        }
    },

    // Renders the specific movie page based user's search and if the movie exists in the database.
    findMovie: function (req, res) {        
        var movie = req.body.search;
        movie = movie.toUpperCase();
        db.findOne(Movie, {m_name: movie}, 'm_id m_trailer m_name m_image m_cast m_synopsis ticket', function(result) {
            if (result)
            {
                var dates = [];
                var timeslots1 = [];
                var timeslots2 = [];
                var outputJQ =[];
                var pm = false;
    
                for (i = 0; i < result.ticket.length; i++) { 
                    var date = result.ticket[i].date;
    
                    var hour = date.getHours();
                    var minute = date.getMinutes();
    
                    var checkDate = date.toLocaleString('default', { month: 'long' });
                    checkDate += " " + date.getDate();
    
                    if (hour > 12) {
                        hour = hour - 12;
                        pm = true;
                    }
                    else if (hour == 12)
                        pm = true;
                    else 
                        pm = false;
    
    
                    hour = (hour < 10) ? "0" + hour : hour;
                    minute = (minute < 10) ? "0" + minute : minute;
    
                    var checkTime = hour + " : " + minute;
                    checkTime = (pm) ? checkTime += " PM" : checkTime += " AM";
                    
                    
                    if (!dates.includes(checkDate)) {
                        dates.push(checkDate); 
                        timeslots1.push(checkTime);
                    }
                    else 
                        timeslots2.push(checkTime);
                }
    
                for (i = 0; i < dates.length; i++) {
                    var output = {
                        dateJQ : dates[i],
                        time1JQ : timeslots1[i],
                        time2JQ : timeslots2[i]
                    }
    
                    outputJQ.push(output);
                }
    
                //NOTE DATES AND QUANTITIES ARE TWO EACH. THE FIRST ONE REFERS TO FIRST MOVIE FOR EACH.
                if(result) {
                    res.render('movie', {layout: '/layouts/layout.hbs', 
                        m_id: result.m_id,
                        m_trailer: result.m_trailer,
                        m_name: result.m_name,
                        m_image: result.m_image,
                        m_cast: result.m_cast,
                        m_synopsis: result.m_synopsis,
                        timeSlotJQ: outputJQ,
                        title: result.m_name + " - Filmworks",
                    });
                }
            }
            else
                res.redirect('/error');
        });
    },

    getError: function(req, res){
        res.render('error', {layout: '/layouts/account.hbs', 
        error: 'This movie does not exist or is not part of our database at the moment',
        error2: 'Please search for another movie or go back to main page.'
    });
    },
    // gets the max capacity available for the movie
    getQuantity: function (req, res) {
        if (PORT == 3000)
            var input = new Date(req.query.ticket);
        else
            var input = new Date(req.query.ticket).tz('Asia/Manila');

        db.findOne(Movie, {m_id: req.query.m_id}, null, function(result){ 
            if (result){
                var maxCapacity;
                for (i = 0; i < result.ticket.length; i++) {
                    if (+result.ticket[i].date === +input){
                        maxCapacity = result.ticket[i].quantity;
                    }  
                }
                res.send(maxCapacity.toString());
            }
        });
        
    },

    //gets main page ot show list of movies
    getMoviePage: function (req, res) {
        if (req.session.email == undefined)
        {
            res.redirect('/');
        }
        else
        {
            db.findMany(Movie, {}, 'm_name m_image m_id', function(result){
                var transaction = result;
                res.render('index', {layout: '/layouts/layout.hbs', movie:transaction, title: "Main - Filmworks"});
            });
        }
    },

    //renders the specific movie page selected by the user from the main page.
    postMoviePage: function (req, res) {
        var movie = req.body.m_id;
        db.findOne(Movie, {m_id: movie}, 'm_id m_trailer m_name m_image m_cast m_synopsis ticket', function(result) {
            var dates = [];
            var timeslots1 = [];
            var timeslots2 = [];
            var outputJQ =[];
            var pm = false;

            for (i = 0; i < result.ticket.length; i++) { 
                var date = result.ticket[i].date;

                var hour = date.getHours();
                var minute = date.getMinutes();

                var checkDate = date.toLocaleString('default', { month: 'long' });
                checkDate += " " + date.getDate();

                if (hour > 12) {
                    hour = hour - 12;
                    pm = true;
                }
                else if (hour == 12)
                    pm = true;
                else 
                    pm = false;


                hour = (hour < 10) ? "0" + hour : hour;
                minute = (minute < 10) ? "0" + minute : minute;

                var checkTime = hour + " : " + minute;
                checkTime = (pm) ? checkTime += " PM" : checkTime += " AM";
                
                
                if (!dates.includes(checkDate)) {
                    dates.push(checkDate); 
                    timeslots1.push(checkTime);
                }
                else 
                    timeslots2.push(checkTime);
            }

            for (i = 0; i < dates.length; i++) {
                var output = {
                    dateJQ : dates[i],
                    time1JQ : timeslots1[i],
                    time2JQ : timeslots2[i]
                }

                outputJQ.push(output);
            }

            if(result) {
                res.render('movie', {layout: '/layouts/layout.hbs', 
                    m_id: result.m_id,
                    m_trailer: result.m_trailer,
                    m_name: result.m_name,
                    m_image: result.m_image,
                    m_cast: result.m_cast,
                    m_synopsis: result.m_synopsis,
                    timeSlotJQ: outputJQ,
                    title: result.m_name + " - Filmworks",
                });
            }
        });
    },
}

module.exports = movie_controller;