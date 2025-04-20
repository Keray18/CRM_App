const express = require('express')
const sequelize = require('./config/dbConn.js')
const dotenv = require('dotenv').config()
const authRoutes = require('./routes/authRoutes.js')
const cors = require('cors')
const app = express()

// Middleware
app.use(express.json())

// Cors
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

// Routes
app.use('/api/auth', authRoutes)

// Warning: Use force: true only in dev
sequelize.sync({ force: true }) 
    .then(() => {
        console.log('✅ Database synced with force');
        app.listen(process.env.PORT, () => console.log(`🚀 Server is running on port ${process.env.PORT}`));
    })
    .catch((err) => console.error('❌ Error syncing database', err));