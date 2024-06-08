const user = require('../models/user')
const admin = require('../models/admin')
const bcrypt = require('bcryptjs')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'images')
    },
    filename: function(req, file, callback){
        console.log(file)
        callback(null, Date.now()+ path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

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

        upload.single("file")
        newUser.image = 'images/' + req.file.filename

        const newRegister = await user.create({fullName: newUser.f_name + newUser.l_name,
                            emailAddress: newUser.email,
                            phoneNumber: newUser.phone,
                            profilePhoto: newUser.image,
                            password: newUser.password,
                            lastLogin: null
        })

        console.log(newRegister.id)

    }
}

module.exports = controller