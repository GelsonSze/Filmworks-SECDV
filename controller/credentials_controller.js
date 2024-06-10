const {user, admin} = require('../models/')
const bcrypt = require('bcryptjs')
const path = require('path')
const db = require('../models/index.js')
const controller = {
    successfulRegister: async function(req, res){

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
        const existingUser = await user.findOne({ where: { emailAddress: req.body.email } });
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
        const existingAdmin = await admin.findOne({ where: { emailAddress: req.body.email } });
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

        newUser.image = '../uploads/' + req.file.filename

        newUser.phone = newUser.phone.replace(/^\+63/, "0");

        const newRegister = await user.create({fullName: newUser.f_name + " " + newUser.l_name,
                            emailAddress: newUser.email,
                            phoneNumber: newUser.phone,
                            profilePhoto: newUser.image,
                            password: newUser.password,
                            lastLogin: null
        })

        console.log(newRegister.id)
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    },

    checkLogin: async function(req, res){
        const { l_email, l_password } = req.body;
        
        try {
            // Find user by email
            const existingUser = await user.findOne({ where: {emailAddress: l_email } });

            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Compare provided password with stored hash
            const isMatch = await bcrypt.compare(l_password, existingUser.password);

            if (isMatch) {
                res.redirect('/main');
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    displayAccount: async function(req, res){
        // replace details here after db is fixed
        const userInfo = await user.findOne({ where: { emailAddress: 'user@gmail.com' }}, function (result){
        })

        //if user info was obtained correctly go display user info
        if (userInfo != null){
            res.render('account',{layout: '/layouts/account.hbs',
                full_name: userInfo.fullName,
                profile_pic: userInfo.profilePhoto, 
                doneMovie: "doneMovies",
                premieringMovies: "premieringMovies",
                title: 'Account - Filmworks'
            });
        }
        else{
            //display error page showing that movies werent rendered properly
        }

    },
    displayadminPage: async function(req, res){
        // replace details here after db is fixed

        const allUsers = await user.findAll();
        const adminInfo = await admin.findOne({ where: { emailAddress: 'admin@gmail.com' }}, function (result){
        })
        //if user info was obtained correctly go display user info
        if (allUsers != null){
            res.render('admin',{layout: '/layouts/account.hbs',
                full_name: "ADMIN", 
                // full_name: adminInfo.fullName, 
                // profile_pic: adminInfo.profilePhoto, 
                profile_pic: "../images/icons/profile.png", 
                user: allUsers,
                title: 'Admin - Filmworks'
            });
        }
        else{
            //display error page showing that movies werent rendered properly
        }

    }
}

module.exports = controller