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
app.use('/api/policies', require('./routes/policyRoutes'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`))
