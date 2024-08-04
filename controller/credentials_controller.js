const {users, admins, Session, bannedIPs, carts, banned_users} = require('../models/')
const bcrypt = require('bcryptjs')
const sanitizeHtml = require('sanitize-html');
const winston = require('winston')

const devLogger = winston.loggers.get("DevLogger")
const registrationLogger = winston.loggers.get("RegistrationLogger")
const authLogger = winston.loggers.get("AuthenticationLogger")
const adminLogger = winston.loggers.get("AdminLogger")

const controller = {
    successfulRegister: async function(req, res){


        if(process.env.NODE_ENV == "development"){
            devLogger.info(JSON.stringify(req.body))

        }
        
        //the total length of email address is 255 characters and the part prior to the @ is at ost 64 characters
        const emailRegex = /^(?=.{1,64}@)(?=.{1,255}$)[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@(([a-zA-Z0-9]+\.[a-zA-Z]{2,}){1,})$/g
        const nameRegex = /^[a-zA-Z\s]+$/
        const phoneRegex1 = /^09[0-9]{9}$/g
        const phoneRegex2 = /^\+639[0-9]{9}$/g
        const passwordRegex = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[^A-Za-z0-9]){1,}).{12,64}$/g

        // if the first and last name does not match the regex
        if (!nameRegex.test(sanitizeHtml(req.body.f_name)) || !nameRegex.test(sanitizeHtml(req.body.l_name))) {
            var info = {
                error:'Invalid name format'
            }
            res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }
        
        // if the phone number does not match the regex
        if (!phoneRegex1.test(sanitizeHtml(req.body.phone)) && !phoneRegex2.test(sanitizeHtml(req.body.phone))) {
            var info = {
                error:'Invalid phone number format'
            }
            res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }

        // if the email does not match the regex
        if (!emailRegex.test(sanitizeHtml(req.body.email))) {
            var info = {
                error:'Invalid email format'
            }
            res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }

        // if the email is already registered by another user
        const existingUser = await users.findOne({ where: { emailAddress: req.body.email }, attributes: ['userID']});
        if (existingUser) {
            var info = {
                error: 'Email already registered'
            };
            res.render('sign_up', { layout: '/layouts/prelogin.hbs',
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }

        // if the email is the admin email
        const existingAdmin = await admins.findOne({ where: { emailAddress: req.body.email }, attributes: ['adminID'] });
        if (existingAdmin) {
            var info = {
                error: 'Invalid Registration'
            };
            res.render('sign_up', { layout: '/layouts/prelogin.hbs',
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }

        // if the password does not match the regex
        if (!passwordRegex.test(sanitizeHtml(req.body.password))) {
            var info = {
                error:'Invalid password format'
            }
            res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }

        // if there is no file uploaded
        if (req.file == undefined) {
            var info = {
                error:'No file uploaded'
            }
            res.render('sign_up',{layout: '/layouts/prelogin.hbs', 
                error: info.error,
                title: 'Sign-Up - Filmworks'
            });
            return;
        }

        var newUser = {
            f_name: sanitizeHtml(req.body.f_name),
            l_name: sanitizeHtml(req.body.l_name),
            email: sanitizeHtml(req.body.email),
            phone: sanitizeHtml(req.body.phone),
            password: sanitizeHtml(req.body.password),
            image: ""
        }

        newUser.password = await bcrypt.hash(req.body.password, 10);

        newUser.image = '../uploads/profiles/' + req.file.filename

        newUser.phone = newUser.phone.replace(/^\+63/, "0");

        const newRegister = await users.create({
                            fullName: newUser.f_name + " " + newUser.l_name,
                            emailAddress: newUser.email,
                            phoneNumber: newUser.phone,
                            profilePhoto: newUser.image,
                            password: newUser.password,
                            lastLogin: null
        })
        
        //create cart for user
        const newCart = await carts.create({userID: newRegister.userID})

        if(process.env.NODE_ENV == "development"){
            devLogger.info(`Created user ${newRegister.userID} for ${newRegister.emailAddress}`)
            devLogger.info(`Created cart ${newCart.cartID} for user ${newRegister.userID}`)
        }else{
            registrationLogger.info(`Created user ${newRegister.userID} for ${newRegister.emailAddress}`)
            registrationLogger.info(`Created cart ${newCart.cartID} for user ${newRegister.userID}`)
        }

        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    },

    checkLogin: async function(req, res){
        const { l_email, l_password } = req.body;
        try {
            // Find user by email
            const existingUser = await users.findOne({ where: {emailAddress: l_email } });

            if (!existingUser) {

                if(process.env.NODE_ENV == "development"){
                    devLogger.error(`Failed login attempt using ${l_email}`)
                }else{
                    authLogger.error(`Failed login attempt using ${l_email}`)
                }

                return res.status(404).json({ message: 'Invalid user or password'});                
            }

            // Compare provided password with stored hash
            const isMatch = await bcrypt.compare(l_password, existingUser.password);


            if (isMatch) {
                
                if(process.env.NODE_ENV == "development"){
                    devLogger.info(`Successful login attempt using ${l_email}`)
                }else{
                    authLogger.info(`Successful login attempt using ${l_email}`)
                }

                res.redirect('/main');
            } else {

                if(process.env.NODE_ENV == "development"){
                    devLogger.error(`Failed login attempt using ${l_email}`)
                }else{
                    authLogger.error(`Failed login attempt using ${l_email}`)
                }

                res.status(401).json({ message: 'Invalid user or password'});
            }
        } catch (error) {
            if(process.env.NODE_ENV == "development"){
                devLogger.error(`On login attempt using ${l_email}: ${error.stack}`)
            }else{
                authLogger.error(`On login attempt using ${l_email}`)
            }
            res.status(500).json({ message: 'An Error Occurred' });
        }
    },

    displayAccount: async function(req, res){
        if (req.user != null){
            try{
                const userInfo = await users.findOne({ where: { emailAddress: req.user.username }, attributes: ['fullName', 'profilePhoto']}, function (result){
                })
                const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['fullName', 'profilePhoto']}, function (result){
                })
    
                if (userInfo){
                    res.render('account',{layout: '/layouts/account.hbs',
                        full_name: userInfo.fullName,
                        profile_pic: userInfo.profilePhoto, 
                        doneMovie: "doneMovies",
                        premieringMovies: "premieringMovies",
                        title: 'Account - Filmworks'
                    });
                }else if(adminInfo){
                    res.render('account',{layout: '/layouts/admin.hbs',
                        full_name: adminInfo.fullName,
                        profile_pic: adminInfo.profilePhoto, 
                        doneMovie: "doneMovies",
                        premieringMovies: "premieringMovies",
                        title: 'Account - Filmworks'
                    });
                }
                else{
                    //error showing account details

                    if(process.env.NODE_ENV == "development"){
                        devLogger.error(`On retreiving account details for ${req.user.username}`)
                    }
                    
                    res.status(500).json({ message: 'An Error Occurred' });
                }
            } catch (error) {
                
                if(process.env.NODE_ENV == "development"){
                    devLogger.error(`On displaying account details for ${req.user.username}: ${error.stack}`)
                }

                res.status(500).json({ message: 'An Error Occurred' });
            }
        }else{
            res.redirect('/')
        }
    },

    displayadminPage: async function(req, res){
        if (req.user){
            try{
                const allUsers = await users.findAll({
                    attributes: ['userID']
                });
                const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['fullName', 'profilePhoto']}, function (result){
                })
                const bannedUsers = await banned_users.findAll({
                    attributes: ['userID']
                })

    
                if (adminInfo){
                    res.render('admin',{layout: '/layouts/admin.hbs',
                        full_name: adminInfo.fullName, 
                        profile_pic: adminInfo.profilePhoto, 
                        user: allUsers,
                        bannedUsers: bannedUsers,
                        title: 'Admin - Filmworks'
                    });
                }
                else{
                    res.redirect('/main')
                }
            } catch (error) {
                
                if(process.env.NODE_ENV == "development"){
                    devLogger.error(`On displaying admin page: ${error.stack}`)
                }

                res.status(500).json({ message: 'An Error Occurred' });
            }
        }
        else{
            res.redirect('/')
        }


    },
    banUser: async function(req, res, next){
        try {
            //check if current user is admin first
            const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }, attributes: ['adminID']})

            //if user is admin
            if (adminInfo){
                const bannedUser = await users.findOne({ 
                    where: { userID: req.body.userID },
                })
                //means user exists
                if (bannedUser){
                    //add bannedUser to banned_users db
                    const check = await banned_users.create({
                        userID: bannedUser.userID,
                        fullName: bannedUser.fullName,
                        emailAddress: bannedUser.emailAddress,
                        phoneNumber: bannedUser.phoneNumber,
                        profilePhoto: bannedUser.profilePhoto,
                        password: bannedUser.password
                    })
                    //remove user from user db
                    const removeCart = await carts.destroy({ where:{
                        userID: bannedUser.userID
                    }})
                    const deleteUser = await users.destroy({ where:{
                        userID: bannedUser.userID
                    }})

                    if (check && deleteUser && removeCart){
                        //means the banning of user was successful

                        if(process.env.NODE_ENV == "development"){
                            devLogger.info(`Banned user ${bannedUser.emailAddress} with ID ${bannedUser.userID}`)
                        }else{
                            authLogger.info(`Banned user ${bannedUser.emailAddress} with ID ${bannedUser.userID}`)
                            adminLogger.info(`Admin ${adminInfo.adminID} banned user ${bannedUser.emailAddress} with ID ${bannedUser.userID}`)
                        }

                        const usersList = await users.findAll({
                                attributes: ['userID']
                        })
                        const bannedList = await banned_users.findAll({
                            attributes: ['userID']
                        })
                        res.render('admin',{layout: '/layouts/admin.hbs',
                            full_name: adminInfo.fullName, 
                            profile_pic: adminInfo.profilePhoto, 
                            user: usersList,
                            bannedUsers: bannedList,
                            title: 'Admin - Filmworks'
                        });
                    }
                }
            }

        } catch (error) {
            if(process.env.NODE_ENV == "development"){
               devLogger.error(`On banning: ${error.stack}`)
            }

            res.status(500).json({ message: 'An Error Occurred' });
        }
    },

    checkAuth: async function(req, res, next){

        const noAuthRequired = ['/', '/register', '/postregister', '/login']
        const urlPath = req.path

        if(req.user){

            if(noAuthRequired.includes(urlPath) == false){ 
                return next() 
            }else{ 
                res.redirect('/main')
            }

        }else{

            if(noAuthRequired.includes(urlPath) == true){
                return next()
            }else{
                res.redirect('/login')
            }
        }
    },
    logoutAccount: async function(req, res, next) {
        try {

            await res.clearCookie('connect.sid')
            await Session.destroy({ where: { session_id: req.sessionID }})
            
        } catch (err) {
            
            if(process.env.NODE_ENV == "development"){
                devLogger.error(`On logging out session ${req.sessionID}: ${err.stack}`)
            }else{
                authLogger.error(`On logging out session ${req.sessionID}`)
            }

            return next(err);
        }

        await req.logout(function(err){
            if(err){

                if(process.env.NODE_ENV == "development"){
                    devLogger.error(`On logging out session ${req.sessionID}: ${err.stack}`)
                }else{
                    authLogger.error(`On logging out session ${req.sessionID}`)
                }

                return next(err)
            }

            req.session.destroy(function(err) {
                if (err) {

                    if(process.env.NODE_ENV == "development"){
                        devLogger.error(`On logging out session ${req.sessionID}: ${err.stack}`)
                    }else{
                        authLogger.error(`On logging out session ${req.sessionID}`)
                    }

                    return next(err);
                }

                if(process.env.NODE_ENV == "development"){
                    devLogger.info(`Successful logout on session ${req.sessionID}`)
                }else{
                    authLogger.info(`Successful logout on session ${req.sessionID}`)
                }

                res.redirect('/login'); // Redirect after successful logout
            });
        })
    },
    userRedirect: async function(req, res){
        const email = req.user.username
        const findUser = await users.findOne({ where: {emailAddress: email}, attributes: ['userID'] })
        
        if(findUser){
            findUser.lastLogin = new Date().toISOString().slice(0, 19).replace('T', ' ')
            await findUser.save();
            res.redirect('/main')
        }else{
            const findAdmin = await admins.findOne({ where: {emailAddress: email}, attributes: ['adminID'] })
            findAdmin.lastLogin = new Date().toISOString().slice(0, 19).replace('T', ' ')
            await findAdmin.save();
            res.redirect('/admin')
        }
    },
    findBannedIP: async function(req, res, next){
        const findIP = await bannedIPs.findOne({where: {IPAddress: req.clientIp}})
        
        if(findIP){
            return res.status(403).json({ message: 'Your IP has been permanently banned.' });
        }

        next()
    },
    banIP: async function(req, res){
        const newBannedIP = await bannedIPs.create({
            IPAddress: req.clientIp
        })

        if(process.env.NODE_ENV == "development"){
            devLogger.info(`Banned IP address: ${newBannedIP.IPAddress}`)
        }else{
            authLogger.info(`Banned IP address: ${newBannedIP.IPAddress}`)
        }

        res.status(400).json({
            message: 'Your IP has been permanently banned',
        });
    }
}

module.exports = controller