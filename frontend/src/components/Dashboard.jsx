import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
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
  Policy as PolicyIcon,
  MonetizationOn as CommissionIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  School as SchoolIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";
import Leads from "./AdminDash/Leads";
import Customers from "./AdminDash/Customers";
import AssignTask from "./AdminDash/AssignTask";
import Documents from "./AdminDash/Documents";
import PolicyStatus from "./AdminDash/PolicyStatus";
import MasterData from './AdminDash/MasterData';
import Commission from './AdminDash/Commission';
import axios from 'axios';
import { getAllPolicies } from '../services/policyService';
import { API_URL } from '../config/config';

const primaryColor = "#1976d2";
const secondaryColor = "#f50057";
const backgroundColor = "#f5f5f5";

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    backgroundColor: "#0C47A0",
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
    { text: "Policy Status", icon: <PolicyIcon />, section: "Policy Status" },
    { text: "Master Data", icon: <PolicyIcon />, section: "Master Data" },
    { text: "Documents", icon: <DocumentIcon />, section: "Documents" },
    { text: "Commission", icon: <CommissionIcon />, section: "Commission" },
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
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    joiningDate: "",
    salary: "",
    address: "",
    education: "",
    experience: "",
    skills: [],
    role: "Employee"
  });
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
  const [openModal, setOpenModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    isLoading: true,
    error: null,
    data: {
      totalEmployees: 0,
      activeLeads: 0,
      activeTasks: 0,
      totalPayments: 0
    }
  });
  const navigate = useNavigate();
  const [localLeads, setLocalLeads] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

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

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setDashboardStats(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [employeesRes, leadsRes, tasksRes, paymentsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/auth/getAllEmployees'),
        // Add other API calls here when available
        Promise.resolve({ data: { leads: leads.filter(lead => !lead.isDeleted && !lead.isConverted) } }),
        Promise.resolve({ data: { tasks: tasks.filter(task => task.status !== 'Completed') } }),
        Promise.resolve({ data: { payments } })
      ]);

      const employeesArray = employeesRes.data.employees || [];
      const activeLeads = leadsRes.data.leads || [];
      const activeTasks = tasksRes.data.tasks || [];
      const totalPayments = paymentsRes.data.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      setDashboardStats({
        isLoading: false,
        error: null,
        data: {
          totalEmployees: employeesArray.length,
          activeLeads: activeLeads.length,
          activeTasks: activeTasks.length,
          totalPayments
        }
      });

      // Update other states as needed
      setTotalEmployees(employeesArray.length);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardStats(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch dashboard statistics'
      }));
      setSnackbar({
        open: true,
        message: "Failed to fetch dashboard statistics",
        severity: "error"
      });
    }
  };

  // Fetch dashboard stats when Dashboard section is selected
  useEffect(() => {
    if (section === "Dashboard") {
      fetchDashboardStats();
    }
  }, [section]);

  // Fetch employees from API
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/auth/getAllEmployees');
      // Extract employees array from the response
      const employeesArray = data.employees || [];
      console.log('Fetched employees:', employeesArray); // Debug log
      setEmployees(employeesArray);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setSnackbar({
        open: true,
        message: "Failed to fetch employees",
        severity: "error"
      });
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees when Manage Employees section is selected
  useEffect(() => {
    if (section === "Manage Employees") {
      fetchEmployees();
    }
  }, [section]);

  // Employee management handlers
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
    if (!formData.position.trim()) errors.position = "Position is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.joiningDate) errors.joiningDate = "Joining date is required";
    if (!formData.salary) errors.salary = "Salary is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.education.trim()) errors.education = "Education is required";
    if (!formData.experience) {
      errors.experience = "Experience is required";
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      errors.experience = "Experience must be a positive number";
    }
    return errors;
  };

  const handleEmployeeSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Format date to YYYY-MM-DD
      const formatDate = (dateString) => {
        if (!dateString) return '';
        // If the date is already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }
        // If the date is in DD-MM-YYYY format, convert it
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
          const [day, month, year] = dateString.split('-');
          return `${year}-${month}-${day}`;
        }
        // If the date is in any other format, try to parse it
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        return date.toISOString().split('T')[0];
      };

      // Generate a random password
      const originalPassword = generatePassword();

      // Structure data according to backend expectations
      const formattedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        department: formData.department,
        position: formData.position.trim(),
        date: formatDate(formData.joiningDate),
        salary: Number(formData.salary),
        education: formData.education.trim(),
        experience: Number(formData.experience),
        password: originalPassword,
        originalPassword: originalPassword, // Add original password to be stored
        role: "Employee"
      };

      console.log('Sending data to backend:', formattedData);

      const { data } = await axios.post('http://localhost:8080/api/auth/register', formattedData);
      
      console.log('Response from backend:', data);

      // Ensure the employee data has all required properties
      const newEmployee = {
        id: data.employee?.id || Date.now(),
        name: data.employee?.name || formattedData.name,
        email: data.employee?.email || formattedData.email,
        phone: data.employee?.phone || formattedData.phone,
        department: data.employee?.department || formattedData.department,
        position: data.employee?.position || formattedData.position,
        joiningDate: data.employee?.date || formattedData.date,
        salary: data.employee?.salary || formattedData.salary,
        address: data.employee?.address || formattedData.address,
        education: data.employee?.education || formattedData.education,
        experience: data.employee?.experience || formattedData.experience,
        password: originalPassword, // Store original password for display
        status: "Active",
        createdAt: new Date().toISOString()
      };
      
      setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        position: "",
        department: "",
        joiningDate: "",
        salary: "",
        address: "",
        education: "",
        experience: "",
        skills: [],
        role: "Employee"
      });
      
      setSnackbar({
        open: true,
        message: "Employee registered successfully",
        severity: "success"
      });

      // Switch to Manage Employees section to show the new employee with password
      setSection("Manage Employees");
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to register employee. Please check all fields and try again.",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password reset functionality
  const handlePasswordReset = async () => {
    try {
    const newPassword = generatePassword();
      
      // Make API call to update password
      const response = await axios.post('http://localhost:8080/api/auth/resetPassword', {
        employeeId: selectedEmployee.id,
        newPassword: newPassword
      });

      if (response.data) {
        // Update the employee's password in the UI
    setEmployees(
      employees.map((emp) =>
        emp === selectedEmployee
          ? { ...emp, password: newPassword }
          : emp
      )
    );
        
        setSnackbar({
          open: true,
          message: `Password reset successfully. New password: ${newPassword}`,
          severity: "success"
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to reset password",
        severity: "error"
      });
    }
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

  const handleTaskSubmit = async () => {
    try {
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
        status: "Pending"
      };

      const response = await axios.post('http://localhost:8080/api/tasks/create', taskData);
      
      if (response.data && response.data.task) {
        setTasks([response.data.task, ...tasks]);
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
        
        setSnackbar({
          open: true,
          message: "Task assigned successfully",
          severity: "success"
        });
      }
    } catch (error) {
      console.error("Task creation error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error creating task. Please try again.",
        severity: "error"
      });
    }
  };

  // Filter employees for search
  const filteredEmployees = Array.isArray(employees) ? employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone?.includes(searchTerm)
  ) : [];

  // Add this useEffect to fetch payments
  useEffect(() => {
    // Sample payment data - Replace with API call in production
    const samplePayments = [
      {
        id: 1,
        companyName: 'ABC Insurance',
        amount: 5000,
        paymentDate: '2024-03-01',
        status: 'Completed',
      },
      {
        id: 2,
        companyName: 'XYZ Insurance',
        amount: 3000,
        paymentDate: '2024-03-15',
        status: 'Pending',
      },
    ];
    setPayments(samplePayments);
  }, []);

  // Calculate payment statistics
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments
    .filter(payment => payment.status === 'Completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments
    .filter(payment => payment.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Add this useEffect to fetch commissions
  useEffect(() => {
    // Sample commission data - Replace with API call in production
    const sampleCommissions = [
      {
        id: 1,
        companyName: 'ABC Insurance',
        commissionRate: '15%',
        totalEarnings: 15000,
        pendingPayments: 5000,
      },
      {
        id: 2,
        companyName: 'XYZ Insurance',
        commissionRate: '12%',
        totalEarnings: 12000,
        pendingPayments: 3000,
      },
    ];
    setCommissions(sampleCommissions);
  }, []);

  // Calculate analytics data
  const analyticsData = commissions.map(commission => ({
    name: commission.companyName,
    rate: parseFloat(commission.commissionRate),
    earnings: commission.totalEarnings,
    pending: commission.pendingPayments,
  }));

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Add fetchLeads function
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
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

  // Update useEffect to fetch leads when task modal opens
  useEffect(() => {
    if (openTaskModal) {
      fetchLeads();
    }
  }, [openTaskModal]);

  // Fetch all policies and populate customers
  useEffect(() => {
    const fetchCustomersFromPolicies = async () => {
      try {
        const policies = await getAllPolicies();
        const customersFromPolicies = policies.map(policy => ({
          id: policy.id,
          name: policy.insuredName,
          phone: policy.mobile,
          email: policy.email,
          policy: policy.type,
          conversionDate: policy.startDate || new Date().toISOString(),
        }));
        setCustomers(customersFromPolicies);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchCustomersFromPolicies();
  }, []);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {section}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              '&:hover': {
                borderColor: '#115293',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            Logout
          </Button>
        </Box>

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
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: primaryColor, color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Total Employees </Typography>
                    {dashboardStats.isLoading ? (
                      <CircularProgress size={40} sx={{ color: 'white', mt: 1 }} />
                    ) : dashboardStats.error ? (
                      <Typography variant="h3" color="error">Error</Typography>
                    ) : (
                      <Typography variant="h3">{dashboardStats.data.totalEmployees}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: secondaryColor, color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Active Leads</Typography>
                    {dashboardStats.isLoading ? (
                      <CircularProgress size={40} sx={{ color: 'white', mt: 1 }} />
                    ) : dashboardStats.error ? (
                      <Typography variant="h3" color="error">Error</Typography>
                    ) : (
                      <Typography variant="h3">{dashboardStats.data.activeLeads}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "success.main", color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Active Tasks</Typography>
                    {dashboardStats.isLoading ? (
                      <CircularProgress size={40} sx={{ color: 'white', mt: 1 }} />
                    ) : dashboardStats.error ? (
                      <Typography variant="h3" color="error">Error</Typography>
                    ) : (
                      <Typography variant="h3">{dashboardStats.data.activeTasks}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "info.main", color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Total Payments</Typography>
                    {dashboardStats.isLoading ? (
                      <CircularProgress size={40} sx={{ color: 'white', mt: 1 }} />
                    ) : dashboardStats.error ? (
                      <Typography variant="h3" color="error">Error</Typography>
                    ) : (
                      <Typography variant="h3">₹{dashboardStats.data.totalPayments.toLocaleString('en-IN')}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Payment Overview Section */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#0C47A0" }}>
              Payment Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary">
                      Completed Payments
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
                      ₹{completedPayments.toLocaleString('en-IN')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary">
                      Pending Payments
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      ₹{pendingPayments.toLocaleString('en-IN')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary">
                      Recent Payments
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {payments.slice(0, 3).map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.companyName}</TableCell>
                              <TableCell>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                              <TableCell>
                                <Chip
                                  label={payment.status}
                                  color={payment.status === 'Completed' ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Analytics Section */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#0C47A0" }}>
              Commission Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Commission Rates by Company
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <BarChart width={500} height={300} data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rate" fill="#8884d8" name="Commission Rate (%)" />
                      </BarChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Earnings Overview
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <BarChart width={500} height={300} data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="earnings" fill="#82ca9d" name="Total Earnings (₹)" />
                        <Bar dataKey="pending" fill="#ffc658" name="Pending Payments (₹)" />
                      </BarChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Payment Analytics */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#0C47A0" }}>
              Payment Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Status Distribution
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <BarChart width={500} height={300} data={[
                        { name: 'Completed', value: completedPayments },
                        { name: 'Pending', value: pendingPayments }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Amount (₹)" />
                      </BarChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Payment Trends
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <BarChart width={500} height={300} data={payments.map(payment => ({
                        name: payment.companyName,
                        amount: payment.amount,
                        date: payment.paymentDate
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#82ca9d" name="Payment Amount (₹)" />
                      </BarChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Employee Registration */}
        {section === "Register Employee" && (
          <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, mb: 6 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              color="#0C47A0"
                sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
            >
                <PersonAddIcon sx={{ mr: 2, fontSize: 32 }} />
              Employee Registration
            </Typography>
              
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Employment Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
                    Employment Details
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.department}
                    helperText={formErrors.department}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.position}
                    helperText={formErrors.position}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Joining Date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.joiningDate}
                    helperText={formErrors.joiningDate}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.salary}
                    helperText={formErrors.salary}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Education & Experience */}
              <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
                    Education & Experience
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                  fullWidth
                    label="Education"
                    name="education"
                    multiline
                    rows={2}
                    value={formData.education}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.education}
                    helperText={formErrors.education}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.experience}
                    helperText={formErrors.experience}
                    inputProps={{ min: 0 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                  variant="contained"
                  size="large"
                  onClick={handleEmployeeSubmit}
                      disabled={isSubmitting}
                  sx={{
                        bgcolor: "#0C47A0",
                    "&:hover": { bgcolor: "#1565c0" },
                        minWidth: 200
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Register Employee"
                      )}
                </Button>
                  </Box>
              </Grid>
            </Grid>
            </Paper>
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
                      "Password",
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <TableRow key={emp.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ mr: 2, bgcolor: "#0C47A0" }}>
                              {emp.name ? emp.name.charAt(0) : '?'}
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
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {emp.password}
                          </Typography>
                        </TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

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

        {/* Other Sections */}
        {section === "Task Assignments" && (
          <AssignTask 
            tasks={tasks} 
            employees={employees}
            leads={leads}
            policies={[]} // You'll need to add policies state if you want to link tasks to policies
          />
        )}
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

        {/* Policy Status */}
        {section === "Policy Status" && <PolicyStatus leads={leads} />}

        {/* Master Data */}
        {section === "Master Data" && <MasterData/>}

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

        {/* Commission */}
        {section === "Commission" && <Commission />}

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

export default Dashboard;