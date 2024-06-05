const mongoose = require('mongoose')
require('dotenv').config()

async function main() {
    await mongoose.connect(`mongodb+srv://gustavowillian0777:wzXSs2AKIpszHhdA@clusterloginsystem.ex0d33h.mongodb.net`)
    console.log('Conexão com o banco realizada com sucesso!')
}

main().catch((err) => console.log(err))

module.exports = mongoose
