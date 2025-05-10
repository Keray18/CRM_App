const express = require('express')
const { sequelize, dbReady } = require('./config/dbConn.js')
const dotenv = require('dotenv').config()
const authRoutes = require('./routes/authRoutes.js')
const leadRoutes = require('./routes/leadRoutes.js')
const taskRoutes = require('./routes/taskRoutes.js')
const masterDataRoutes = require('./routes/masterDataRoutes.js')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')

const app = express()

// Security middleware
app.use(helmet())

// Compression middleware
app.use(compression())

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Optimized CORS configuration
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Cache control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=31557600'); // 1 year
    next();
});

// Import all models
const MasterData = require('./models/MasterData');
const Employee = require('./models/empModel');
const Task = require('./models/TaskModel');
const Leads = require('./models/LeadsModel');
const Policy = require('./models/Policy');

// Sync all models and start server
async function startServer() {
    await dbReady;
    try {
        await sequelize.authenticate();
        await Promise.all([
            MasterData.sync({ alter: true }),
            Employee.sync({ alter: true }),
            Task.sync({ alter: true }),
            Leads.sync({ alter: true }),
            Policy.sync({ alter: true })
        ]);
        console.log('✅ All models synchronized successfully');
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Error during startup:', err);
        process.exit(1);
    }
}

startServer();

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/policies', require('./routes/policyRoutes'))
app.use('/api/masterdata', masterDataRoutes)

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
})
