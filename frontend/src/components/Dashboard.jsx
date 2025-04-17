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
import PolicyManagement from './AdminDash/PolicyManagement';
import Commission from './AdminDash/Commission';

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    joiningDate: "",
    salary: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
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
  const navigate = useNavigate();

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
    if (!formData.emergencyContact.trim()) errors.emergencyContact = "Emergency contact is required";
    if (!formData.emergencyPhone.trim()) {
      errors.emergencyPhone = "Emergency phone is required";
    } else if (!/^\d{10}$/.test(formData.emergencyPhone)) {
      errors.emergencyPhone = "Phone must be 10 digits";
    }
    if (!formData.education.trim()) errors.education = "Education is required";
    if (!formData.experience.trim()) errors.experience = "Experience is required";
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
      const newEmployee = {
        ...formData,
        id: Date.now(),
        password: generatePassword(),
        status: "Active",
        createdAt: new Date().toISOString()
      };
      setEmployees([...employees, newEmployee]);
      setFormData({
        name: "",
        phone: "",
        email: "",
        position: "",
        department: "",
        joiningDate: "",
        salary: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to register employee",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    <Typography variant="h6">Total Employees</Typography>
                    <Typography variant="h3">{employees.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: secondaryColor, color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Active Leads</Typography>
                    <Typography variant="h3">{activeLeads.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "success.main", color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Active Tasks</Typography>
                    <Typography variant="h3">{tasks.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: "info.main", color: "white", p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Total Payments</Typography>
                    <Typography variant="h3">₹{totalPayments.toLocaleString('en-IN')}</Typography>
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

                {/* Emergency Contact */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
                    Emergency Contact
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.emergencyContact}
                    helperText={formErrors.emergencyContact}
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
                    label="Emergency Contact Phone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.emergencyPhone}
                    helperText={formErrors.emergencyPhone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'primary.main' }} />
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
                    label="Experience"
                    name="experience"
                    multiline
                    rows={2}
                    value={formData.experience}
                    onChange={handleEmployeeChange}
                    error={!!formErrors.experience}
                    helperText={formErrors.experience}
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
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 2, bgcolor: "#0C47A0" }}>
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
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                  sx={{ 
                    backgroundColor: "white",
                    borderRadius: 1,
                    "& .MuiInputLabel-root": { color: "black" },
                    "& .MuiOutlinedInput-root": { color: "black" }
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
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
                    disabled={!taskForm.taskType || !taskForm.description || !taskForm.dueDate}
                    sx={{
                      bgcolor: "#0C47A0",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
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
        {section === "Master Data" && <PolicyManagement />}

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