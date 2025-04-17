import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';

const MyTasks = ({ tasks, setTasks }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setOpenViewDialog(true);
  };

  const handleEdit = (task) => {
    setEditTask({ ...task });
    setOpenEditDialog(true);
  };

  const handleDelete = (task) => {
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  const handleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'Completed' }
        : task
    ));
  };

  const handleSaveEdit = () => {
    if (!editTask) return;

    setTasks(tasks.map(task => 
      task.id === editTask.id 
        ? { ...editTask }
        : task
    ));

    setOpenEditDialog(false);
    setEditTask(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedTask) return;

    setTasks(tasks.filter(task => task.id !== selectedTask.id));
    setOpenDeleteDialog(false);
    setSelectedTask(null);
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
          {editTask && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="Description"
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Due Date"
                type="date"
                value={editTask.dueDate}
                onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Status"
                value={editTask.status}
                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <TextField
                select
                label="Priority"
                value={editTask.priority}
                onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                fullWidth
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
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
    </Box>
  );
};

export default MyTasks; 