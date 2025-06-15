import React, { useState, useEffect } from "react";
import { API_URL } from "../../config/config";
import axios from "axios";
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
  Chip,
  Avatar,
  TextField,
  Button,
  Modal,
  Grid,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop
} from "@mui/material";
import {
  Assignment as TaskIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Description as PolicyIcon,
  Business as LeadIcon
} from "@mui/icons-material";
import authHeader from '../../services/authHeader';

const AssignTask = ({ 
  employees = [], 
  leads = [], 
  policies = [] 
}) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    employeeId: "",
    employeeName: "",
    taskType: "",
    description: "",
    dueDate: "",
    status: "Pending",
    leadId: "",
    policyId: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [localLeads, setLocalLeads] = useState([]);
  const [localEmployees, setLocalEmployees] = useState([]);
  const [localPolicies, setLocalPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchLeads(), fetchEmployees(), fetchPolicies()]).finally(() => setLoading(false));
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, { headers: authHeader() });
      setTasks(response.data.tasks);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching tasks",
        severity: "error"
      });
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`, { headers: authHeader() });
      setLocalLeads(response.data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setSnackbar({
        open: true,
        message: "Error fetching leads",
        severity: "error"
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/getAllEmployees`, { headers: authHeader() });
      setLocalEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setSnackbar({
        open: true,
        message: "Error fetching employees",
        severity: "error"
      });
    }
  };

  const fetchPolicies = async () => {
    try {
      const response = await axios.get(`${API_URL}/policies`, { headers: authHeader() });
      setLocalPolicies(response.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching policies",
        severity: "error"
      });
    }
  };

  const taskTypes = [
    "Follow-up",
    "Documentation",
    "Meeting",
    "Training",
    "Policy Review",
    "Lead Management",
    "Other"
  ];

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setTaskForm({
      ...taskForm,
      employeeId: employee.id,
      employeeName: employee.name
    });
    setOpenTaskModal(true);
  };

  const handleTaskSubmit = async () => {
    try {
      setAssigning(true);
      // Validate required fields
      if (!taskForm.employeeId || !taskForm.taskType || !taskForm.description || !taskForm.dueDate) {
        setSnackbar({
          open: true,
          message: "Please fill in all required fields",
          severity: "error"
        });
        return;
      }

      // Format the task data
      const taskData = {
        employeeId: taskForm.employeeId,
        employeeName: taskForm.employeeName,
        taskType: taskForm.taskType,
        description: taskForm.description,
        dueDate: new Date(taskForm.dueDate).toISOString(),
        status: "Pending",
        leadId: taskForm.leadId || null,
        policyId: taskForm.policyId || null
      };

      const response = await axios.post(`${API_URL}/tasks/create`, taskData, { headers: authHeader() });
      
      if (response.data && response.data.task) {
        setOpenTaskModal(false);
        // Reset form
        setTaskForm({
          employeeId: "",
          employeeName: "",
          taskType: "",
          description: "",
          dueDate: "",
          status: "Pending",
          leadId: "",
          policyId: ""
        });
        setSelectedEmployee(null);
        // Refetch all tasks to get populated lead/policy info
        await fetchTasks();
        setSnackbar({
          open: true,
          message: "Task assigned successfully",
          severity: "success"
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Task creation error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error creating task. Please try again.",
        severity: "error"
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}/status`, {
        status: newStatus
      }, { headers: authHeader() });
      
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.task : task
      ));
      
      setSnackbar({
        open: true,
        message: "Task status updated successfully",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error updating task status",
        severity: "error"
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, { headers: authHeader() });
      
      setTasks(tasks.filter(task => task.id !== taskId));
      
      setSnackbar({
        open: true,
        message: "Task deleted successfully",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error deleting task",
        severity: "error"
      });
    }
  };

  const filteredEmployees = localEmployees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone?.includes(searchTerm)
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Loading Spinner Overlay */}
      <Backdrop open={loading || assigning} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, ml: 2 }}>
          {assigning ? 'Assigning task...' : 'Loading...'}
        </Typography>
      </Backdrop>

      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }} color="#0C47A0">
        <TaskIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Task Assignments
      </Typography>

      {/* Employee Search */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="#666">
          Search Employee to Assign Task
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiInputBase-input": {
                color: "black",
              },
            },
            "& .MuiInputLabel-root": {
              color: "black",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#666" }} />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Employee Search Results */}
        {searchTerm && (
          <Paper sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}>
            {filteredEmployees.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography color="text.secondary">No employees found</Typography>
              </Box>
            ) : (
              filteredEmployees.map((employee) => (
                <Box
                  key={employee.id}
                  onClick={() => handleEmployeeSelect(employee)}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {employee.name ? employee.name.charAt(0) : '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{employee.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employee.email} • {employee.phone}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        )}
      </Box>

      {/* Task Assignment Modal */}
      <Modal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        aria-labelledby="task-assignment-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Assign Task to {taskForm.employeeName}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={taskForm.taskType}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, taskType: e.target.value })
                  }
                  label="Task Type"
                >
                  {taskTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, dueDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Lead</InputLabel>
                <Select
                  value={taskForm.leadId}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, leadId: e.target.value })
                  }
                  label="Select Lead"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {localLeads.map((lead) => (
                    <MenuItem key={lead.id} value={lead.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          {lead.leadName ? lead.leadName.charAt(0) : '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{lead.leadName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lead.leadPhone} • {lead.leadEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Related Policy</InputLabel>
                <Select
                  value={taskForm.policyId}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, policyId: e.target.value })
                  }
                  label="Related Policy"
                >
                  <MenuItem value="">None</MenuItem>
                  {localPolicies.map((policy) => (
                    <MenuItem key={policy.id} value={policy.id}>
                      {policy.policyNumber} - {policy.insuredName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Task Description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={() => setOpenTaskModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleTaskSubmit}
                  disabled={!taskForm.taskType || !taskForm.description || !taskForm.dueDate || assigning}
                  startIcon={assigning ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {assigning ? 'Assigning...' : 'Assign Task'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Tasks Dashboard */}
      <Typography variant="h6" gutterBottom color="#666" sx={{ mt: 4 }}>
        Assigned Tasks
      </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Task</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Related To</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ p: 4, color: 'text.secondary' }}>
                    No tasks have been assigned yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {task.employeeName ? task.employeeName.charAt(0) : '?'}
                      </Avatar>
                      {task.employeeName}
                    </Box>
                  </TableCell>
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {/* Show Lead info if present */}
                    {task.lead && (
                      <Chip
                        icon={<LeadIcon />}
                        label={`Lead: ${task.lead.leadName}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {/* Show Policy info if present */}
                    {task.policy && (
                      <Chip
                        icon={<PolicyIcon />}
                        label={`Policy: ${task.policy.policyNumber}`}
                        size="small"
                      />
                    )}
                    {/* Fallback if neither is present */}
                    {(!task.lead && !task.policy) && (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={task.status}
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
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

      {/* Snackbar for notifications */}
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

export default AssignTask;