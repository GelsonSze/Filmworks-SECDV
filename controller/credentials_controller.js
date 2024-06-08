const {user, admin} = require('../models/')
const bcrypt = require('bcryptjs')

const controller = {
    successfulRegister: async function(req, res){
        var newUser = {
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            image: ""
        }

        bcrypt.hash(newUser.password, 10, function(err, hash){
            user.password = hash
        })

        newUser.image = 'images/' + req.file.filename

        const newRegister = await user.create({fullName: newUser.f_name + " " + newUser.l_name,
                            emailAddress: newUser.email,
                            phoneNumber: newUser.phone,
                            profilePhoto: newUser.image,
                            password: newUser.password,
                            lastLogin: null
        })

        console.log(newRegister.id)
        // res.render('sign_in',  {layout: '/layouts/prelogin.hbs',  title: 'Sign-In - Filmworks'})
    }
}

module.exports = controller