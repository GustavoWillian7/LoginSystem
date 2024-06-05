const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {
    // Create token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'secretforloginsystem')

    // Return token
    res.status(200).json({
        message: 'Usuário autenticado com sucesso!',
        token: token,
        userId: user._id
    })

}

module.exports = createUserToken
