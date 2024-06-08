// Models
const User = require('../models/User')

// Frameworks
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // Validations
        if (!name) {
            res.status(422).json({ 
                message: 'O nome é obrigatório.'
            })
            return
        }

        if (!email) {
            res.status(422).json({ 
                 message: 'O email é obrigatório.' 
            })
            return
        }

        if (!phone) {
            res.status(422).json({ 
                message: 'O telefone é obrigatório.' 
            })
            return
        }

        if (!password) {
            res.status(422).json({ 
                message: 'A senha é obrigatória.' 
            })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ 
                message: 'A confirmação de senha é obrigatória.' 
            })
            return
        }

        // Check if the confirmation password is equal to password
        if (password !== confirmpassword) {
            res.status(422).json({ 
                message: 'Senhas não conferem.' 
            })
            return
        }

        // Check if the user exists
        const userExists = await User.findOne({ email: email})

        if (userExists) {
            res.status(422).json({ 
                message: 'Email já cadastrado.' 
            })
            return
        }

        // Create a encrypted password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        // Save new user
        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ 
                 message: 'O email é obrigatório.' 
            })
            return
        }

        if (!password) {
            res.status(422).json({ 
                message: 'A senha é obrigatória.' 
            })
            return
        }

        // Check if the user doesn't exists
        const user = await User.findOne({ email: email})

        if (!user) {
            res.status(422).json({ 
                message: 'Email não cadastrado.' 
            })
            return
        }

        // Check if the password matches the db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({
                message: 'Senha incorreta.'
            })
        }

        await createUserToken(user, req, res)
    } 

    // Check the user using token
    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secretforloginsystem')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    // Get the user infos by id
    static async getUserById(req, res) {
        const id = req.params.id

        // Check if the user exists
        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(422).json({
                message: 'Usuário não encontrado.'
            })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        // Check if the user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        if (req.file) {
            user.image = req.file.filename
        }

        // Validations
        if (!name) {
            res.status(422).json({ 
                message: 'O nome é obrigatório.'
            })
            return
        }

        if (!email) {
            res.status(422).json({ 
                 message: 'O email é obrigatório.' 
            })
            return
        }

        // Check if the email has already been taken
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({
                message: 'Email já cadastrado.'
            })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ 
                message: 'O telefone é obrigatório.' 
            })
            return
        }

        user.phone = phone

        if (password !== confirmpassword) {
            res.status(422).json({ 
                message: 'Senhas não conferem.' 
            })
            return
        } else if (password === confirmpassword && password != null) {
            // Create a encrypted password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            // Returns updated data
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({
                message: 'Usuário atualizado com sucesso!'
            })
        } catch (error) {
            res.status(500).json({
                message: error
            })
            return
        }
    }
}
