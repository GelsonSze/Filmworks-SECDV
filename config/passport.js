const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {users, admins} = require('../models/')
const winston = require('winston')
require('../logger/logger.js')

const devLogger = winston.loggers.get("DevLogger")
const authLogger = winston.loggers.get("AuthenticationLogger")

const userFields = {
    usernameField: 'l_email',
    passwordField: 'l_password'
}

const verifyCallback = async function(email, password, callback){
    const findUser = await users.findOne({ where: {emailAddress: email}})
    const findAdmin = await admins.findOne({ where: {emailAddress: email} })

    if (!findUser && !findAdmin) {

      if(process.env.NODE_ENV == "development"){
        devLogger.error(`Failed login attempt using ${email}`)
      }else{
        authLogger.error(`Failed login attempt using ${email}`)
      }

       return callback(null, false)
    }

    let isMatch = false
    let existingUser = null

    if(findUser){
      existingUser = findUser
      isMatch = await bcrypt.compare(password, existingUser.password)
    }else{
      existingUser = findAdmin
      isMatch = await bcrypt.compare(password, existingUser.password)
    }

    if(!isMatch){
      
      if(process.env.NODE_ENV == "development"){
        devLogger.error(`Failed login attempt using ${email}`)
      }else{
        authLogger.error(`Failed login attempt using ${email}`)
      }
      
      return callback(null, false)
    }else{

      if(process.env.NODE_ENV == "development"){
        devLogger.info(`Successful login attempt using ${email}`)
      }else{
        authLogger.info(`Successful login attempt using ${email}`)
      }

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