const { Sequelize } = require('sequelize')
const mysql = require('mysql2/promise');
const dbConfig = require('./db.config.js')

// Function to ensure database exists
async function ensureDatabaseExists() {
    const connection = await mysql.createConnection({
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);
    await connection.end();
}

// Ensure DB exists before Sequelize connects
const dbReady = ensureDatabaseExists().then(() => {
    console.log(`✅ Database '${dbConfig.DB}' exists or was created.`);
}).catch((err) => {
    console.error('❌ Error creating database:', err);
    process.exit(1);
});

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    define: {
        timestamps: true,
        underscored: true, // Use snake_case for column names
        freezeTableName: true // Don't pluralize table names
    },
    pool: {
        max: 2,      // <= LIMIT THIS TO 2 or 3 (never 5)
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

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
    })
    .catch((err) => console.log('❌ Error connecting to MySQL', err));

module.exports = { sequelize, dbReady };