const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {users, admins} = require('../models/')

const userFields = {
    usernameField: 'l_email',
    passwordField: 'l_password'
}

const verifyCallback = async function(email, password, callback){
    const findUser = await users.findOne({ where: {emailAddress: email}})
    const findAdmin = await admins.findOne({ where: {emailAddress: email} })

    if (!findUser && !findAdmin) {
       return callback(null, false)
    }

    let isMatch = false
    let existingUser = null

    if(findUser){
      console.log(findUser)
      existingUser = findUser
      isMatch = await bcrypt.compare(password, existingUser.password)
    }else{
      console.log(findAdmin)
      existingUser = findAdmin
      isMatch = await bcrypt.compare(password, existingUser.password)
    }

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