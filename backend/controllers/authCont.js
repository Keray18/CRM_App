const Employee = require("../models/empModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Register a new employee
const register = async (req, res) => {
    try {
        let {name, email, phone, address, department, position, date, salary, education, experience, password, role } = req.body
        if (email === 'jason@gmail.com') {
            role = 'admin';
        }
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
            originalPassword: password, // Store the original password
            role: role || 'standard'
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
            password: emp.originalPassword, // Return original password instead of hashed
            role: emp.role // Always include the role field
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
            // If admin user does not exist, create it with role 'admin'
            if (email === 'jason@gmail.com') {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newAdmin = await Employee.create({
                    name: 'Admin User',
                    email: 'jason@gmail.com',
                    phone: '9999999999',
                    address: 'Admin Address',
                    department: 'Admin',
                    position: 'Admin',
                    date: new Date(),
                    salary: 0,
                    education: 'Admin',
                    experience: 0,
                    password: hashedPassword,
                    originalPassword: password,
                    role: 'admin'
                });
                // Continue login with the new admin
                const token = jwt.sign({ id: newAdmin.id }, process.env.JWT_SECRET, { expiresIn: '7d'});
                return res.status(200).json({
                    message: 'Login successful',
                    name: newAdmin.name,
                    employee: {
                        ...newAdmin.toJSON(),
                        password: newAdmin.originalPassword
                    },
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, employee.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        // Force role to admin for jason@gmail.com
        if (email === 'jason@gmail.com') {
            if (employee.role !== 'admin') {
                employee.role = 'admin';
                await employee.save();
            }
        }
        const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, { expiresIn: '7d'})
        res.status(200).json({
            message: 'Login successful',
            name: employee.name,
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

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        await employee.destroy();
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};

// Update an employee (role, etc.)
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Only allow updating certain fields (e.g., role)
        if (typeof updates.role !== 'undefined') {
            employee.role = updates.role;
        }
        // Add more fields as needed
        await employee.save();
        res.status(200).json({ message: 'Employee updated', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

module.exports = { register, login, getAllEmployees, resetPassword, deleteEmployee, updateEmployee }