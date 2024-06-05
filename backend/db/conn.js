const mongoose = require('mongoose')
require('dotenv').config()

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@clusterloginsystem.ex0d33h.mongodb.net/mydatabase?retryWrites=true&w=majority`)
    console.log('Conexão com o banco realizada com sucesso!')
}

main().catch((err) => console.log(err))

module.exports = mongoose
