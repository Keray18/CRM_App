const express = require('express')
const sequelize = require('./config/dbConn.js')
const dotenv = require('dotenv').config()
const authRoutes = require('./routes/authRoutes.js')
const leadRoutes = require('./routes/leadRoutes.js')
const taskRoutes = require('./routes/taskRoutes.js')
const cors = require('cors')
const app = express()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Cors
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/tasks', taskRoutes)

// Start server
app.listen(process.env.PORT, () => console.log(`🚀 Server is running on port ${process.env.PORT}`));