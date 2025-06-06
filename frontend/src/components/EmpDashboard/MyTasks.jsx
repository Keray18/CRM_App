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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { API_URL } from '../../config/config';
import axios from 'axios';
import authHeader from '../../services/authHeader';

const MyTasks = ({ employeeId, employeeName, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    taskType: '',
    description: '',
    dueDate: '',
  });
  const [statusLoadingId, setStatusLoadingId] = useState(null); // Track which task is updating
  const [deletingTaskId, setDeletingTaskId] = useState(null); // Track which task is being deleted
  const [creating, setCreating] = useState(false);
  const TASKS_PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setTasks([]);
    setPage(1);
    setHasMore(true);
    fetchTasks(1, true);
  }, [employeeId]);

  const fetchTasks = async (pageToLoad = page, reset = false) => {
    try {
      setLoading(true);
      console.log('Fetching tasks for employeeId:', employeeId, 'page:', pageToLoad);
      const response = await axios.get(`${API_URL}/tasks/employee/${employeeId}?page=${pageToLoad}&limit=${TASKS_PAGE_SIZE}`, {
        headers: authHeader()
      });
      console.log('Fetched tasks response:', response.data);
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(prev => reset ? response.data.tasks : [...prev, ...response.data.tasks]);
        setHasMore(response.data.tasks.length === TASKS_PAGE_SIZE);
      } else {
        setTasks([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching tasks. Please try again.',
        severity: 'error'
      });
      setTasks([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTasks(nextPage);
    }
  };

  // Listen for scroll to bottom of table container
  const tableContainerRef = React.useRef();
  useEffect(() => {
    const handleScroll = () => {
      const el = tableContainerRef.current;
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 50 && hasMore && !loading) {
        handleLoadMore();
      }
    };
    const el = tableContainerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, [hasMore, loading, page]);

  const handleDelete = async (taskId) => {
    setDeletingTaskId(taskId);
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: authHeader()
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      if (statusLoadingId === taskId) setStatusLoadingId(null); // Clear status loading if deleted
      if (onTaskUpdate) onTaskUpdate();
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting task',
        severity: 'error'
      });
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setStatusLoadingId(taskId);
    try {
      await axios.patch(`${API_URL}/tasks/${taskId}/status`, {
        status: newStatus
      }, {
        headers: authHeader()
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
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
    } finally {
      setStatusLoadingId(null);
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#4caf50'; // Green
      case 'live':
        return '#2196f3'; // Blue
      case 'pending':
        return '#ff9800'; // Orange
      default:
        return '#757575'; // Grey
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  const handleCreateTask = async () => {
    setCreating(true);
    try {
      console.log('Creating task for employeeId:', employeeId, 'with data:', newTask);
      await axios.post(`${API_URL}/tasks/create`, {
        employeeId,
        employeeName,
        ...newTask
      }, {
        headers: authHeader()
      });
      setSnackbar({
        open: true,
        message: 'Task created successfully',
        severity: 'success'
      });
      setOpenDialog(false);
      setNewTask({ taskType: '', description: '', dueDate: '' });
      await fetchTasks(); // Await to ensure tasks are refreshed before UI update
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error creating task',
        severity: 'error'
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Tasks
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenDialog}>
        Create Task
      </Button>
      
      {/* Loading overlay for the whole table */}
      <Backdrop open={loading || creating} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, ml: 2 }}>
          {creating ? 'Creating task...' : 'Loading tasks...'}
        </Typography>
      </Backdrop>

      <TableContainer component={Paper} ref={tableContainerRef} sx={{ 
        borderRadius: 3,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'auto',
        maxHeight: 500
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
            {(!loading && tasks.length === 0) ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No tasks assigned</TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {/* Show Lead info if present */}
                      {task.lead && (
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, letterSpacing: 0.2 }}>
                          Lead: {task.lead.leadName}
                        </Typography>
                      )}
                      {/* Show Policy info if present */}
                      {task.policy && (
                        <Typography variant="body2" sx={{ color: '#0C47A0', fontWeight: 600, letterSpacing: 0.2 }}>
                          Policy: {task.policy.policyNumber}
                        </Typography>
                      )}
                      {/* Fallback if neither is present */}
                      {(!task.lead && !task.policy) && (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </Box>
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
                        disabled={statusLoadingId === task.id || deletingTaskId === task.id}
                        startIcon={statusLoadingId === task.id ? <CircularProgress size={16} color="inherit" /> : null}
                      >
                        {statusLoadingId === task.id ? 'Starting...' : 'Start'}
                      </Button>
                    )}
                    {task.status === 'In Progress' && (
                      <Button
                        color="success"
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                        size="small"
                        sx={{ mr: 1 }}
                        disabled={statusLoadingId === task.id || deletingTaskId === task.id}
                        startIcon={statusLoadingId === task.id ? <CircularProgress size={16} color="inherit" /> : null}
                      >
                        {statusLoadingId === task.id ? 'Completing...' : 'Complete'}
                      </Button>
                    )}
                    <Button
                      color="error"
                      onClick={() => handleDelete(task.id)}
                      size="small"
                      disabled={statusLoadingId === task.id || deletingTaskId === task.id}
                      startIcon={deletingTaskId === task.id ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Lazy loading spinner row */}
            {hasMore && !loading && tasks.length > 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} color="primary" />
                  <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>Loading more tasks...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Task Type"
            name="taskType"
            value={newTask.taskType}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Due Date"
            name="dueDate"
            type="date"
            value={newTask.dueDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained" color="primary" disabled={creating} startIcon={creating ? <CircularProgress size={18} color="inherit" /> : null}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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