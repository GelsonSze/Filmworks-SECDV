const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {user, admin} = require('../models/')

const userFields = {
    usernameField: 'l_email',
    passwordField: 'l_password'
}

const verifyCallback = async function(email, password, callback){
    const existingUser = await user.findOne({ where: {emailAddress: email} })

    if (!existingUser) {
       return callback(null, false)
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)

    if(!isMatch){
        console.log("no match")
        return callback(null, false)
    }else{
        console.log("match")
        return callback(null, existingUser)
    }
}

const strategy = new LocalStrategy(userFields, verifyCallback)
passport.use(strategy);

passport.serializeUser(function(user, callback) {
    process.nextTick(function() {
      return callback(null, {
        id: user.id,
        username: user.emailAddress,
        picture: user.profilePhoto
      });
    });
  });
  
  passport.deserializeUser(function(user, callback) {
    process.nextTick(function() {
      return callback(null, user);
    });
  });