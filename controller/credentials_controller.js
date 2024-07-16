const {users, admins, sessions, bannedIPs, carts, banned_users} = require('../models/')
const bcrypt = require('bcryptjs')
const db = require('../models/index.js')
const controller = {
    successfulRegister: async function(req, res){

        console.log("REGISTRATION CONTENTS")
        console.log(req.body)

        if(process.env.NODE_ENV == "development"){
            console.log(req.body)

        }
        
        const emailRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@(([a-zA-Z0-9]+\.[a-zA-Z]{2,}){1,})$/g
        const nameRegex = /^[a-zA-Z\s]+$/
        const phoneRegex1 = /^09[0-9]{9}$/g
        const phoneRegex2 = /^\+639[0-9]{9}$/g
        const passwordRegex = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[^A-Za-z0-9]){1,}).{12,64}$/g

        // if the first and last name does not match the regex
        if (!nameRegex.test(req.body.f_name) || !nameRegex.test(req.body.l_name)) {
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
        if (!phoneRegex1.test(req.body.phone) && !phoneRegex2.test(req.body.phone)) {
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
        if (!emailRegex.test(req.body.email)) {
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
        const existingUser = await users.findOne({ where: { emailAddress: req.body.email } });
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
        const existingAdmin = await admins.findOne({ where: { emailAddress: req.body.email } });
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
        if (!passwordRegex.test(req.body.password)) {
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
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
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
            console.log("New Register ID " + newRegister.userID)
            console.log("New User Cart ID " + newCart.cartID)
        }

        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    },

    checkLogin: async function(req, res){
        const { l_email, l_password } = req.body;
        
        try {
            // Find user by email
            const existingUser = await users.findOne({ where: {emailAddress: l_email } });

            if (!existingUser) {
                return res.status(404).json({ message: 'Invalid user or password'});
            }

            // Compare provided password with stored hash
            const isMatch = await bcrypt.compare(l_password, existingUser.password);


            if (isMatch) {
                res.redirect('/main');
            } else {
                res.status(401).json({ message: 'Invalid user or password'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An Error Occurred' });
        }
    },

    displayAccount: async function(req, res){
        if (req.user != null){
            try{
                const userInfo = await users.findOne({ where: { emailAddress: req.user.username }}, function (result){
                })
                const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }}, function (result){
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
        }else{
            res.redirect('/')
        }



    },
    displayadminPage: async function(req, res){
        if (req.user){
            try{
                const allUsers = await users.findAll();
                const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }}, function (result){
                })
                const bannedUsers = await banned_users.findAll()

    
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
                    console.error(error);
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
            const adminInfo = await admins.findOne({ where: { emailAddress: req.user.username }})

            //if user is admin
            if (adminInfo){
                const bannedUser = await users.findOne({ where: { userID: req.body.userID }})
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
                        const users = await users.findAll()
                        const banned = await banned_users.findAll()
                        res.render('admin',{layout: '/layouts/admin.hbs',
                            full_name: adminInfo.fullName, 
                            profile_pic: adminInfo.profilePhoto, 
                            user: users,
                            bannedUsers: banned,
                            title: 'Admin - Filmworks'
                        });
                    }
                }
            }

        } catch (error) {
            if(process.env.NODE_ENV == "development"){
                console.error(error);
            }

            res.status(500).json({ message: 'An Error Occurred' });
        }
    },

    checkAuth: async function(req, res, next){
        if(req.user){
            return next()
        }else{
            res.redirect('/login')
        }
    },
    checknoAuth: async function(req, res, next){
        if(!req.user){
            return next()
        }else{
            res.redirect('/main')
        }
    },
    logoutAccount: async function(req, res, next) {
        try {

            if(process.env.NODE_ENV == "development"){
                console.log(req.sessionID)
            }

            await res.clearCookie('connect.sid')
            const doneDestroy = await sessions.destroy({ where: { session_id: req.sessionID }});

            if(process.env.NODE_ENV == "development"){
                console.log("LOGOUT RESULTS")
                console.log(doneDestroy)
            }
            
        } catch (err) {
            return next(err);
        }

        await req.logout(function(err){
            if(err){
                return next(err)
            }

            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/login'); // Redirect after successful logout
            });
        })
    },
    userRedirect: async function(req, res){
        const email = req.user.username
        const findUser = await users.findOne({ where: {emailAddress: email} })
        
        if(findUser){
            findUser.lastLogin = new Date().toISOString().slice(0, 19).replace('T', ' ')
            await findUser.save();
            res.redirect('/main')
        }else{
            const findAdmin = await admins.findOne({ where: {emailAddress: email} })
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

        res.status(400).json({
            message: 'Your IP has been permanently banned',
        });
    }
}

module.exports = controller