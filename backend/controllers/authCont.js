const Employee = require("../models/empModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

// Register a new employee
const register = async (req, res) => {
    try {
        const {name, email, phone, address, department, position, date, salary, education, experience, password } = req.body
        const existingEmployee = await Employee.findOne({ where: { email}})
        if (existingEmployee) {
            return res.status(400).json({
                message: 'Employee already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newEmployee = await Employee.create({
            name: name,
            email: email,
            phone: phone,
            address: address,
            department: department,
            position: position,
            date: date,
            salary: salary,
            education: education,
            experience: experience,
            password: hashedPassword,
            originalPassword: password // Store the original password
        })
        res.status(201).json({
            message: 'Employee registered successfully',
            employee: {
                ...newEmployee.toJSON(),
                password: password 
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error registering employee',
            error: error.message
        })
    }
}

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll()
        const employeesWithOriginalPasswords = employees.map(emp => ({
            ...emp.toJSON(),
            password: emp.originalPassword // Return original password instead of hashed
        }))
        res.status(200).json({
            employees: employeesWithOriginalPasswords
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees',
            error: error.message
        })
    }
}

// Login an employee
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }
        const employee = await Employee.findOne({ where: { email }})
        if (!employee) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const isPasswordValid = await bcrypt.compare(password, employee.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, { expiresIn: '7d'})
        res.status(200).json({
            message: 'Login successful',
            employee: {
                ...employee.toJSON(),
                password: employee.originalPassword // Return original password
            },
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        })
    }
}

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { employeeId, newPassword } = req.body
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        const employee = await Employee.findByPk(employeeId)
        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            })
        }

        await employee.update({
            password: hashedPassword,
            originalPassword: newPassword
        })

        res.status(200).json({
            message: 'Password reset successfully',
            employee: {
                ...employee.toJSON(),
                password: newPassword // Return the new original password
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error resetting password',
            error: error.message
        })
    }
}


module.exports = { register, login, getAllEmployees, resetPassword }