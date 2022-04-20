const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts2', 'root', '1234',{ //usuario e senha db
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso!')
} catch(err) {
    console.log(`Não foi possivel conecetar ${err}`)
}

module.exports = sequelize