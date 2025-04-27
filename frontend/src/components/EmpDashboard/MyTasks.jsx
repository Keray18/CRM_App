import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks');
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching tasks. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in progress':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setOpenViewDialog(true);
  };

  const handleEdit = (task) => {
    setEditForm({
      status: task.status,
      description: task.description
    });
    setOpenEditDialog(true);
  };

  const handleDelete = (task) => {
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  const handleComplete = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${taskId}`, {
        status: 'Completed'
      });
      if (response.data && response.data.task) {
        setTasks(tasks.map(task => 
          task.id === taskId ? response.data.task : task
        ));
        setSnackbar({
          open: true,
          message: 'Task marked as completed',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setSnackbar({
        open: true,
        message: 'Error updating task. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${selectedTask.id}`, {
        status: editForm.status,
        description: editForm.description
      });
      if (response.data && response.data.task) {
        setTasks(tasks.map(task => 
          task.id === selectedTask.id ? response.data.task : task
        ));
        setOpenEditDialog(false);
        setSnackbar({
          open: true,
          message: 'Task updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setSnackbar({
        open: true,
        message: 'Error updating task. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask) return;

    try {
      await axios.delete(`http://localhost:8080/api/tasks/${selectedTask.id}`);
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setOpenDeleteDialog(false);
      setSelectedTask(null);
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting task. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        My Tasks
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.assignedBy}</TableCell>
                    <TableCell>
                      <Tooltip title="View Task">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(task)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {task.status !== 'Completed' && (
                        <>
                          <Tooltip title="Edit Task">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(task)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Complete Task">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleComplete(task.id)}
                            >
                              <CompleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Task">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(task)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Task Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>{selectedTask.title}</Typography>
              <Typography variant="body1" paragraph>{selectedTask.description}</Typography>
              <Typography variant="body2" color="textSecondary">
                Due Date: {selectedTask.dueDate}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {selectedTask.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Priority: {selectedTask.priority}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Assigned By: {selectedTask.assignedBy}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Status"
                select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <TextField
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
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