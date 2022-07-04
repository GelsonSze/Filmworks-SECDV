/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

const db = require('../database/models/db.js');
const User = require('../database/models/User.js');

db.connect();

/*
    creates an object
    containing prodid, prodname, pimages, priceBefore, priceNow, description, details, and reviews
*/
const users = [
    {
        username: "25jicomposer",
        f_name: "Kanade",
        l_name: "Yoisaki",
        email: "k@gmail.com",
        password: "$2a$10$2jOBOluullR5Quo0HVQ72OR2/ndQLv.o4cLf1TyBopP689WjY4oXC",
        status: "SENIOR CITIZEN/PWD",
        image: "./public/status/284206465_781799269894644_260962508013605260_n.png",
        movieDetails: [],
      },
      {

        username: "poneglyphs",
        f_name: "Robin",
        l_name: "Nico",
        email: "robin@gmail.com",
        password: "$2a$10$ERlPOI223qwgpWxAJheKYOzdPyeZ7s3KwXyS3/SoFR8Z06tdE8EDO",
        status: "REGULAR",
        image: "poneglyphsnone",
        movieDetails: [],
      },{

        username: "sherilyn123",
        f_name: "Sherilyn",
        l_name: "Ng",
        email: "sherilyn@gmail.com",
        password: "$2a$10$MYdrKDM116lI9TEqefzchOeB8RRD/eyG8rbtkcpU3CZKdnid3Ym/C",
        status: "REGULAR",
        image: "sherilyn123none",
        movieDetails: [],
      },
      {
        username: "hello_world",
        f_name: "Hello",
        l_name: "World",
        email: "hello_world@gmail.com",
        password: "$2a$10$1WndR.6KmlPC64bJcOK0XujXiSbnNQ7Y.o2GKDrnChVK4Gy4cAWWW",
        status: "SENIOR CITIZEN/PWD",
        image: "./public/status/ca08cff753ccdc0c5666300bfb821fce.jpg",
        movieDetails: [],
      },{
        username: "julianne123",
        f_name: "Julianne",
        l_name: "Vizmanos",
        email: "julianne@gmail.com",
        password: "$2a$10$yGBGpKsIxAvBmqnRlUsMNesNEtje0K11dq0UfzhloExu64kDVX2dC",
        status: "REGULAR",
        image: "julianne123none",
        movieDetails: [],
      }
]

db.insertMany(User,users, () => console.log('Users inserted successfully'));