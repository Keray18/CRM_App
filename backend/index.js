const express = require('express')
const { sequelize, dbReady } = require('./config/dbConn.js')
const dotenv = require('dotenv').config()
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')

// Import routes
const authRoutes = require('./routes/authRoutes.js')
const leadRoutes = require('./routes/leadRoutes.js')
const taskRoutes = require('./routes/taskRoutes.js')
const masterDataRoutes = require('./routes/masterDataRoutes.js')

// Import models
const MasterData = require('./models/MasterData')
const Employee = require('./models/empModel')
const Task = require('./models/TaskModel')
const Leads = require('./models/LeadsModel')
const Policy = require('./models/Policy')
const Document = require('./models/documentModel')
const Payment = require('./models/Payment')
const Customer = require('./models/Customer')

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'cache-control',
        'pragma',
        'if-modified-since',
        'if-none-match',
        'x-requested-with',
        'accept'
    ]
}))

// Cache control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=31557600'); // 1 year
    next();
});

// Define Sequelize associations
Payment.belongsTo(Policy, { foreignKey: 'policyId', as: 'policy' });
Policy.hasMany(Payment, { foreignKey: 'policyId', as: 'payments' });

// Sync all models and start server
async function startServer() {
    await dbReady;
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Synchronize models
        await Promise.all([
            MasterData.sync(),
            Employee.sync(),
            Task.sync(),
            Leads.sync(),
            Policy.sync(),
            Document.sync(),
            Payment.sync(),
            Customer.sync()
        ]);
        console.log('✅ All models synchronized successfully.');

        // Start the server
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
app.use('/api/customers', require('./routes/customerRoutes'))
app.use('/api/masterdata', masterDataRoutes)
app.use('/api/documents', require('./routes/documentRoutes'))
app.use('/api/commissions', require('./routes/commissionRoutes'))
app.use('/api/payments', require('./routes/paymentRoutes'))

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
})
