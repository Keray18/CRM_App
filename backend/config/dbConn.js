const { Sequelize } = require('sequelize')
const dbConfig = require('./db.config.js')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
})

sequelize.authenticate()
.then(() => console.log('✅ Connected to MySQL successfully'))
.catch((err) => console.log('❌ Error connecting to MySQL', err))

module.exports = sequelize