import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import { API_URL } from "../config/config";

const AddEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        date: '',
        salary: '',
        education: '',
        experience: '',
        role: 'Employee'
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [errors, setErrors] = useState({});

    const departments = ["Sales", "Support", "Development", "Marketing", "HR"];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.position) newErrors.position = 'Position is required';
        if (!formData.date) newErrors.date = 'Joining date is required';
        if (!formData.salary) newErrors.salary = 'Salary is required';
        if (!formData.education) newErrors.education = 'Education is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        
        // Email validation
        if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        
        // Phone validation
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is changed
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setMessage('Please fill in all required fields correctly');
            setSeverity('error');
            setOpen(true);
            return;
        }

        try {
            // Generate a random password
            const password = Math.random().toString(36).slice(-8);
            
            // Format the data according to backend requirements
            const formattedData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                department: formData.department,
                position: formData.position.trim(),
                date: new Date(formData.date).toISOString(),
                salary: parseInt(formData.salary, 10),
                education: formData.education.trim(),
                experience: parseInt(formData.experience, 10),
                password,
                role: formData.role
            };

            const response = await axios.post(`${API_URL}/auth/register`, formattedData);

            if (response.data) {
                setMessage(`Employee registered successfully! Password: ${password}`);
                setSeverity('success');
                setOpen(true);
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    department: '',
                    position: '',
                    date: '',
                    salary: '',
                    education: '',
                    experience: '',
                    role: 'Employee'
                });
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            setMessage(error.response?.data?.message || 'Error registering employee');
            setSeverity('error');
            setOpen(true);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
            />
            <FormControl fullWidth margin="normal" error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="Department"
                    required
                >
                    {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                            {dept}
                        </MenuItem>
                    ))}
                </Select>
                {errors.department && (
                    <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {errors.department}
                    </Box>
                )}
            </FormControl>
            <TextField
                margin="normal"
                required
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={!!errors.position}
                helperText={errors.position}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Joining Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                error={!!errors.salary}
                helperText={errors.salary}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                error={!!errors.education}
                helperText={errors.education}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Experience (Years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                error={!!errors.experience}
                helperText={errors.experience}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                >
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                </Select>
            </FormControl>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Register Employee
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddEmployee; 