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

// Function to sync database
const syncDatabase = async () => {
    try {
        // Sync without force to preserve data
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully');
    } catch (error) {
        console.error('❌ Error syncing database', error);
    }
};

// Authenticate and sync
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connected to MySQL successfully');
        return syncDatabase();
    })
    .catch((err) => console.log('❌ Error connecting to MySQL', err));

module.exports = sequelize