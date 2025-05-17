import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { API_URL } from '../../config/config';
import axios from 'axios';

const MyTasks = ({ employeeId, employeeName, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [employeeId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks/employee/${employeeId}`, {
        withCredentials: true
      });

      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching tasks. Please try again.',
        severity: 'error'
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        withCredentials: true
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      // Notify parent component to update task count
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting task',
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        status: newStatus
      }, {
        withCredentials: true
      });
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Notify parent component to update task count
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      
      setSnackbar({
        open: true,
        message: 'Task status updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      setSnackbar({
        open: true,
        message: 'Error updating task status',
        severity: 'error'
      });
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#4caf50'; // Green
      case 'in progress':
        return '#2196f3'; // Blue
      case 'pending':
        return '#ff9800'; // Orange
      default:
        return '#757575'; // Grey
    }
  };

  return (
    <Box>
      <Typography variant="h4" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Tasks
      </Typography>
      
      <TableContainer component={Paper} sx={{ 
        borderRadius: 3,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#0C47A0' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Task</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Related To</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading tasks...</TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No tasks assigned</TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {task.leadId && (
                      <Box sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: '#f5f5f5',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1
                      }}>
                        <Typography variant="body2">
                          Lead: {task.leadName || 'N/A'}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      bgcolor: getStatusColor(task.status),
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.875rem'
                    }}>
                      {task.status || 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {task.status === 'Pending' && (
                      <Button
                        color="primary"
                        onClick={() => handleStatusChange(task.id, 'In Progress')}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'In Progress' && (
                      <Button
                        color="success"
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Complete
                      </Button>
                    )}
                    <Button
                      color="error"
                      onClick={() => handleDelete(task.id)}
                      size="small"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyTasks; 