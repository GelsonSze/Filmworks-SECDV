const {user, admin} = require('../models/')
const bcrypt = require('bcryptjs')
const path = require('path')

const controller = {
    successfulRegister: async function(req, res){

        const emailRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@(([a-zA-Z0-9]+\.[a-zA-Z]{2,}){1,})$/g
        const nameRegex = /^[a-zA-Z\s]+$/
        const phoneRegex1 = /^09[0-9]{9}$/g
        const phoneRegex2 = /^\+639[0-9]{9}$/g
        const passwordRegex = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*[0-9]){1,})(?=(?:.*[^A-Za-z0-9]){1,}).{12,64}$/g
        var phone = false

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

        console.log(req.file)
        console.log(req.file.filename)

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

        newUser.image = './public/uploads/' + req.file.filename

        const newRegister = await user.create({fullName: newUser.f_name + " " + newUser.l_name,
                            emailAddress: newUser.email,
                            phoneNumber: newUser.phone,
                            profilePhoto: newUser.image,
                            password: newUser.password,
                            lastLogin: null
        })

        console.log(newRegister.id)
        res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    }
}

module.exports = controller