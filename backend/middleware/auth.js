const jwt = require('jsonwebtoken');
const Employee = require('../models/empModel');
require('dotenv').config();

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employee = await Employee.findByPk(decoded.id);
        if (!employee) {
            return res.status(401).json({ message: 'Invalid token: user not found' });
        }
        req.user = employee;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate; 