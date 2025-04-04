import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  useTheme,
  Avatar,
  Chip,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  AssignmentTurnedIn as TaskIcon,
  Search as SearchIcon,
  Description as DocumentIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Leads from "./AdminDash/Leads";
import Customers from "./AdminDash/Customers";
import AssignTask from "./AdminDash/AssignTask";
import Documents from "./AdminDash/Documents";

const primaryColor = "#1976d2";
const secondaryColor = "#f50057";
const backgroundColor = "#f5f5f5";

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    backgroundColor: primaryColor,
    color: "#fff",
    width: 240,
    transition: "all 0.3s ease",
  },
});

const Sidebar = ({ section, setSection }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Register Employee", icon: <PersonAddIcon /> },
    { text: "Manage Employees", icon: <PeopleIcon /> },
    { text: "Task Assignments", icon: <TaskIcon /> },
    { text: "Leads", icon: <AssignmentIcon /> },
    { text: "Customers", icon: <GroupIcon /> },
    { text: "Documents", icon: <DocumentIcon /> },
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          Admin Panel
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => setSection(item.text)}
            sx={{
              backgroundColor: section === item.text ? "#115293" : "inherit",
              borderLeft: section === item.text ? "4px solid #fff" : "none",
              cursor: "pointer",
              py: 2,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: section === item.text ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

const generatePassword = () => Math.random().toString(36).slice(-8);

const Dashboard = () => {
  const [section, setSection] = useState("Dashboard");
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentFiles, setDocumentFiles] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    policyNumber: "",
  });
  const [taskForm, setTaskForm] = useState({
    employeeId: "",
    employeeName: "",
    taskType: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });
  const [openModal, setOpenModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  const departments = ["Sales", "Support", "Development", "Marketing", "HR"];
  const taskTypes = [
    "Follow-up",
    "Documentation",
    "Meeting",
    "Training",
    "Other",
  ];

  // Filter leads to show only active leads (not converted or deleted)
  const activeLeads = leads.filter(lead => 
    !lead.isDeleted && !lead.isConverted
  );

  // Employee management handlers
  const handleEmployeeChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeSubmit = () => {
    const newEmployee = {
      ...formData,
      id: Date.now(),
      password: generatePassword(),
    };
    setEmployees([...employees, newEmployee]);
    setFormData({
      name: "",
      phone: "",
      email: "",
      position: "",
      department: "",
      policyNumber: "",
    });
  };

  // Password reset functionality
  const handlePasswordReset = () => {
    setEmployees(
      employees.map((emp) =>
        emp === selectedEmployee
          ? { ...emp, password: generatePassword() }
          : emp
      )
    );
    setOpenModal(false);
  };

  // Task management handlers
  const handleTaskAssign = (employee) => {
    setTaskForm({
      ...taskForm,
      employeeId: employee.id,
      employeeName: employee.name,
    });
    setOpenTaskModal(true);
  };

  const addCustomer = (lead) => {
    // Update the lead to mark it as converted
    setLeads(prevLeads => 
      prevLeads.map(l => 
        l.id === lead.id 
          ? { ...l, isConverted: true }
          : l
      )
    );

    // Add the lead as a customer
    setCustomers([
      ...customers,
      { 
        ...lead, 
        id: Date.now(),
        leadId: lead.id,
        conversionDate: new Date().toISOString() 
      },
    ]);
  };

  const handleDeleteLead = (leadId) => {
    // Mark the lead as deleted instead of removing it
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, isDeleted: true }
          : lead
      )
    );
  };

  const handleAddLead = (newLead) => {
    // Add isConverted and isDeleted flags to new leads
    setLeads([
      ...leads,
      {
        ...newLead,
        id: Date.now(),
        isConverted: false,
        isDeleted: false
      }
    ]);
  };

  const handleTaskSubmit = () => {
    setTasks([
      ...tasks,
      {
        ...taskForm,
        id: Date.now(),
        assignedDate: new Date().toLocaleDateString(),
      },
    ]);
    setOpenTaskModal(false);
    setTaskForm({
      employeeId: "",
      employeeName: "",
      taskType: "",
      description: "",
      dueDate: "",
      status: "Pending",
    });
  };

  // Filter employees for search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm)
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: backgroundColor,
      }}
    >
      <Sidebar section={section} setSection={setSection} />

      <Box component="main" sx={{ flexGrow: 1, p: 4, pl: 35 }}>
        {/* Dashboard Overview */}
        {section === "Dashboard" && (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              sx={{ color: "#0C47A0" }}
            >
              Dashboard Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: primaryColor, color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Total Employees</Typography>
                    <Typography variant="h3">{employees.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: secondaryColor, color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Active Leads</Typography>
                    <Typography variant="h3">{activeLeads.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: "success.main", color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Active Tasks</Typography>
                    <Typography variant="h3">{tasks.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Employee Registration */}
        {section === "Register Employee" && (
          <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="#0C47A0"
            >
              <PersonAddIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
              Employee Registration
            </Typography>
            <Grid
              container
              spacing={3}
              sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}
            >
              {[
                "name",
                "email",
                "phone",
                "position",
                "department",
                "policyNumber",
              ].map((field) => (
                <Grid item xs={12} md={6} key={field}>
                  <TextField
                    fullWidth
                    label={field.replace(/([A-Z])/g, " $1")}
                    name={field}
                    value={formData[field]}
                    onChange={handleEmployeeChange}
                    select={field === "department"}
                    InputProps={{
                      startAdornment: field === "name" && (
                        <InputAdornment position="start">
                          <Avatar sx={{ width: 24, height: 24 }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {field === "department" &&
                      departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleEmployeeSubmit}
                  sx={{
                    bgcolor: primaryColor,
                    "&:hover": { bgcolor: "#1565c0" },
                  }}
                >
                  Register Employee
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Employee Management */}
        {section === "Manage Employees" && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="#0C47A0"
            >
              Employee Management
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search employees..."
              fullWidth
              sx={{
                mb: 3,
                backgroundColor: "white",
                "& .MuiInputBase-input": {
                  color: "black",
                },
                "&::placeholder": {
                  color: "gray",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "primary.main" }}>
                  <TableRow>
                    {[
                      "Employee",
                      "Contact",
                      "Department",
                      "Position",
                      "Actions",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 2, bgcolor: primaryColor }}>
                            {emp.name.charAt(0)}
                          </Avatar>
                          {emp.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography>{emp.email}</Typography>
                          <Typography variant="body2">{emp.phone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.department}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{ mr: 1 }}
                          onClick={() => handleTaskAssign(emp)}
                        >
                          Assign Task
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setOpenModal(true);
                          }}
                        >
                          Reset Password
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Task Assignment Modal */}
        <Modal open={openTaskModal} onClose={() => setOpenTaskModal(false)}>
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
                <TextField
                  select
                  fullWidth
                  label="Task Type"
                  value={taskForm.taskType}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, taskType: e.target.value })
                  }
                >
                  {taskTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                />
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
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button onClick={() => setOpenTaskModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleTaskSubmit}
                    disabled={!taskForm.taskType || !taskForm.description}
                  >
                    Assign Task
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        {/* Other Sections */}
        {section === "Task Assignments" && <AssignTask tasks={tasks} />}
        {section === "Leads" && (
          <Leads 
            leads={activeLeads} 
            setLeads={setLeads}
            addCustomer={addCustomer}
            onDeleteLead={handleDeleteLead}
            onAddLead={handleAddLead}
          />
        )}
        {section === "Customers" && (
          <Customers customers={customers} setCustomers={setCustomers} />
        )}

        {/* Documents */}
        {section === "Documents" && (
          <Documents 
            customers={customers} 
            documents={documents}
            setDocuments={setDocuments}
            documentFiles={documentFiles}
            setDocumentFiles={setDocumentFiles}
          />
        )}

        {/* Password Reset Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Reset Password
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Reset password for <strong>{selectedEmployee?.name}</strong>?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button variant="contained" onClick={handlePasswordReset}>
                Confirm Reset
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Dashboard;
