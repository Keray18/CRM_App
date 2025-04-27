const { Sequelize } = require('sequelize')
const dbConfig = require('./db.config.js')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    define: {
        timestamps: true,
        underscored: true, // Use snake_case for column names
        freezeTableName: true // Don't pluralize table names
    }
})

// Authenticate connection
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connected to MySQL successfully');
    })
    .catch((err) => console.log('❌ Error connecting to MySQL', err));

module.exports = sequelize