import React, { useState } from "react";
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
  Alert
} from "@mui/material";
import {
  Assignment as TaskIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Description as PolicyIcon,
  Business as LeadIcon
} from "@mui/icons-material";

const AssignTask = ({ 
  tasks = [], 
  employees = [], 
  leads = [], 
  policies = [] 
}) => {
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

  const handleTaskSubmit = () => {
    // Add task to the list
    const newTask = {
      ...taskForm,
      id: Date.now(),
      assignedDate: new Date().toLocaleDateString()
    };
    tasks.push(newTask);
    
    setOpenTaskModal(false);
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
    
    setSnackbar({
      open: true,
      message: "Task assigned successfully",
      severity: "success"
    });
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm)
  );

  return (
    <Box sx={{ p: 3 }}>
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
                    {employee.name.charAt(0)}
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
                  {leads.map((lead) => (
                    <MenuItem key={lead.id} value={lead.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          {lead.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{lead.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lead.phone} • {lead.email}
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
                  {policies.map((policy) => (
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
                  disabled={!taskForm.taskType || !taskForm.description || !taskForm.dueDate}
                >
                  Assign Task
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
              </TableRow>
            </TableHead>
            <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ p: 4, color: 'text.secondary' }}>
                    No tasks have been assigned yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {task.employeeName.charAt(0)}
                      </Avatar>
                      {task.employeeName}
                    </Box>
                  </TableCell>
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {task.leadId && (
                      <Chip
                        icon={<LeadIcon />}
                        label={`Lead: ${leads.find(l => l.id === task.leadId)?.name || 'N/A'}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {task.policyId && (
                      <Chip
                        icon={<PolicyIcon />}
                        label={`Policy: ${policies.find(p => p.id === task.policyId)?.policyNumber || 'N/A'}`}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={
                        task.status === 'Pending' ? 'warning' :
                        task.status === 'Completed' ? 'success' : 'default'
                      }
                    />
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