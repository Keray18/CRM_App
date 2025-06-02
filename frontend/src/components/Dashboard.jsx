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
  Stack,
  Checkbox,
  FormControlLabel,
  Switch,
  IconButton,
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
  ExpandMore as ExpandMoreIcon,
  InfoOutlined as InfoOutlinedIcon,
  Timeline as TimelineIcon,
  EventAvailable as EventAvailableIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';
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
import Collapse from '@mui/material/Collapse';
import EditIcon from '@mui/icons-material/Edit';
import authHeader from '../services/authHeader';

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
    role: "standard",
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
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
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [policyStats, setPolicyStats] = useState({
    typeDistribution: [],
    statusDistribution: [],
    monthlyPremiums: [],
    businessDistribution: []
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const taskTypes = [
    "Follow-up",
    "Documentation",
    "Meeting",
    "Training",
    "Other",
  ];

  const role = localStorage.getItem('role'); // 'privileged' or 'standard'
  const isPrivileged = role === 'privileged';

  // Filter leads to show only active leads (not converted or deleted)
  const activeLeads = leads.filter(lead => 
    !lead.isDeleted && !lead.isConverted
  );

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setDashboardStats(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [employeesRes, leadsRes, tasksRes, paymentsRes, policiesRes] = await Promise.all([
        axios.get(`${API_URL}/auth/getAllEmployees`, { headers: authHeader() }),
        axios.get(`${API_URL}/leads`, { headers: authHeader() }),
        axios.get(`${API_URL}/tasks`, { headers: authHeader() }),
        axios.get(`${API_URL}/payments`, { headers: authHeader() }),
        getAllPolicies(),
      ]);

      const employeesArray = employeesRes.data.employees || [];
      const activeLeads = (leadsRes.data.leads || []).filter(lead => !lead.isDeleted && !lead.isConverted);
      const activeTasks = (tasksRes.data.tasks || []).filter(task => task.status !== 'Completed');
      const totalPayments = paymentsRes.data.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      // Set policies
      setPolicies(policiesRes || []);

      // Calculate policy statistics
      if (policiesRes && policiesRes.length > 0) {
        // Calculate policy type distribution
        const typeCount = policiesRes.reduce((acc, policy) => {
          acc[policy.type] = (acc[policy.type] || 0) + 1;
          return acc;
        }, {});
        
        const typeDistribution = Object.entries(typeCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }));

        // Calculate status distribution
        const statusCount = policiesRes.reduce((acc, policy) => {
          acc[policy.status] = (acc[policy.status] || 0) + 1;
          return acc;
        }, {});
        
        const statusDistribution = Object.entries(statusCount).map(([name, value]) => ({
          name,
          value
        }));

        // Calculate monthly premiums
        const monthlyPremiums = policiesRes.reduce((acc, policy) => {
          const month = new Date(policy.startDate).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + (policy.totalPremium || 0);
          return acc;
        }, {});
        
        const monthlyPremiumData = Object.entries(monthlyPremiums).map(([month, amount]) => ({
          month,
          amount
        }));

        // Calculate new vs renewal business
        const businessCount = policiesRes.reduce((acc, policy) => {
          acc[policy.business] = (acc[policy.business] || 0) + 1;
          return acc;
        }, {});
        
        const businessDistribution = Object.entries(businessCount).map(([type, count]) => ({
          type,
          count
        }));

        setPolicyStats({
          typeDistribution,
          statusDistribution,
          monthlyPremiums: monthlyPremiumData,
          businessDistribution
        });
      }

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
      setEmployees(employeesArray);
      setLeads(leadsRes.data.leads || []);
      setTasks(tasksRes.data.tasks || []);
      setPayments(paymentsRes.data.payments || []);
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
      const { data } = await axios.get(`${API_URL}/auth/getAllEmployees`, { headers: authHeader() });
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

  // Helper to check if current user is admin
  const isAdmin = localStorage.getItem("userRole") === "admin";

  // Employee management handlers
  const handleEmployeeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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
        role: formData.role,
      };

      console.log('Sending data to backend:', formattedData);

      const { data } = await axios.post(`${API_URL}/auth/register`, formattedData, { headers: authHeader() });
      
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
        createdAt: new Date().toISOString(),
        role: formattedData.role,
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
        role: "standard",
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
      const response = await axios.post(`${API_URL}/auth/resetPassword`, {
        employeeId: selectedEmployee.id,
        newPassword: newPassword
      }, { headers: authHeader() });

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
    setLeads(prevLeads => 
      prevLeads.map(l => 
        l.id === lead.id 
          ? { ...l, isConverted: true }
          : l
      )
    );

    setCustomers([
      ...customers,
      { 
        ...lead, 
        id: Date.now(),
        leadId: lead.id,
        conversionDate: new Date().toISOString().split("T")[0],
        status: "Active",
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

      const response = await axios.post(`${API_URL}/tasks/create`, taskData, { headers: authHeader() });
      
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

  // Filter employees to hide admin from the table
  const filteredEmployees = Array.isArray(employees) ? employees.filter(
    (emp) =>
      emp.email !== 'jason@gmail.com' &&
      (emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.includes(searchTerm))
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

  // Delete employee functionality
  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${API_URL}/auth/${employeeId}`, { headers: authHeader() });
      
      // Remove the employee from the local state
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      
      setSnackbar({
        open: true,
        message: "Employee deleted successfully",
        severity: "success"
      });
      setOpenDeleteModal(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error deleting employee",
        severity: "error"
      });
    }
  };

  useEffect(() => {
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_URL}/masterdata/type/Department`, { headers: authHeader() });
        setDepartments(response.data.filter(item => item.isActive).map(item => item.name));
      } catch (error) {
        setDepartments([]);
      }
    };
    // Fetch positions
    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${API_URL}/masterdata/type/Position`, { headers: authHeader() });
        setPositions(response.data.filter(item => item.isActive).map(item => item.name));
      } catch (error) {
        setPositions([]);
      }
    };
    fetchDepartments();
    fetchPositions();
  }, []);

  // Fetch policy statistics
  useEffect(() => {
    const fetchPolicyStats = async () => {
      try {
        const policies = await getAllPolicies();
        
        // Calculate policy type distribution
        const typeCount = policies.reduce((acc, policy) => {
          acc[policy.type] = (acc[policy.type] || 0) + 1;
          return acc;
        }, {});
        
        const typeDistribution = Object.entries(typeCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }));

        // Calculate status distribution
        const statusCount = policies.reduce((acc, policy) => {
          acc[policy.status] = (acc[policy.status] || 0) + 1;
          return acc;
        }, {});
        
        const statusDistribution = Object.entries(statusCount).map(([name, value]) => ({
          name,
          value
        }));

        // Calculate monthly premiums
        const monthlyPremiums = policies.reduce((acc, policy) => {
          const month = new Date(policy.startDate).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + (policy.totalPremium || 0);
          return acc;
        }, {});
        
        const monthlyPremiumData = Object.entries(monthlyPremiums).map(([month, amount]) => ({
          month,
          amount
        }));

        // Calculate new vs renewal business
        const businessCount = policies.reduce((acc, policy) => {
          acc[policy.business] = (acc[policy.business] || 0) + 1;
          return acc;
        }, {});
        
        const businessDistribution = Object.entries(businessCount).map(([type, count]) => ({
          type,
          count
        }));

        setPolicyStats({
          typeDistribution,
          statusDistribution,
          monthlyPremiums: monthlyPremiumData,
          businessDistribution
        });
      } catch (error) {
        console.error('Error fetching policy statistics:', error);
      }
    };

    fetchPolicyStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Helper: Top 3 companies by policy count
  const topCompanies = React.useMemo(() => {
    const companyCount = {};
    policies.forEach(p => {
      if (p.company) companyCount[p.company] = (companyCount[p.company] || 0) + 1;
    });
    return Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([company, count]) => ({ company, count }));
  }, [policies]);

  // Helper: Recent policies (last 5)
  const recentPolicies = React.useMemo(() => {
    return [...policies]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [policies]);

  // Helper: Policy status breakdown
  const statusBreakdown = React.useMemo(() => {
    const statusCount = {};
    policies.forEach(p => {
      statusCount[p.status] = (statusCount[p.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
  }, [policies]);

  // Helper: Upcoming expirations (next 30 days)
  const upcomingExpirations = React.useMemo(() => {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 30);
    return policies
      .filter(p => p.endDate && new Date(p.endDate) > now && new Date(p.endDate) <= soon)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      .slice(0, 5);
  }, [policies]);

  // Add handler to update privilege
  const handlePrivilegeToggle = async (emp) => {
    try {
      const newRole = emp.role === 'standard' ? 'privileged' : 'standard';
      const updated = { ...emp, role: newRole };
      await axios.put(`${API_URL}/auth/${emp.id}`, { role: newRole }, { headers: authHeader() });
      setEmployees(employees.map(e => e.id === emp.id ? updated : e));
      setSnackbar({ open: true, message: `Privilege ${updated.role === 'privileged' ? 'granted' : 'revoked'} for ${emp.name}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update privilege', severity: 'error' });
    }
  };

  // Add fetchPolicies function
  const fetchPolicies = async () => {
    try {
      const data = await getAllPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  // Add useEffect to fetch policies and update stats
  useEffect(() => {
    if (section === "Dashboard") {
      fetchPolicies();
      fetchDashboardStats();
    }
  }, [section]);

  // Update policyStats when policies change
  useEffect(() => {
    if (policies.length > 0) {
      // Calculate policy type distribution
      const typeCount = policies.reduce((acc, policy) => {
        acc[policy.type] = (acc[policy.type] || 0) + 1;
        return acc;
      }, {});
      
      const typeDistribution = Object.entries(typeCount).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));

      // Calculate status distribution
      const statusCount = policies.reduce((acc, policy) => {
        acc[policy.status] = (acc[policy.status] || 0) + 1;
        return acc;
      }, {});
      
      const statusDistribution = Object.entries(statusCount).map(([name, value]) => ({
        name,
        value
      }));

      // Calculate monthly premiums
      const monthlyPremiums = policies.reduce((acc, policy) => {
        const month = new Date(policy.startDate).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + (policy.totalPremium || 0);
        return acc;
      }, {});
      
      const monthlyPremiumData = Object.entries(monthlyPremiums).map(([month, amount]) => ({
        month,
        amount
      }));

      // Calculate new vs renewal business
      const businessCount = policies.reduce((acc, policy) => {
        acc[policy.business] = (acc[policy.business] || 0) + 1;
        return acc;
      }, {});
      
      const businessDistribution = Object.entries(businessCount).map(([type, count]) => ({
        type,
        count
      }));

      setPolicyStats({
        typeDistribution,
        statusDistribution,
        monthlyPremiums: monthlyPremiumData,
        businessDistribution
      });
    }
  }, [policies]);

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
        {/* Greeting Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 0.5 }}>
              Welcome, Admin!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's your CRM policy management overview.
            </Typography>
          </Box>
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
            {/* Only keep the first row of cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: primaryColor, color: "white", p: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h6">Total Employees </Typography>
                    </Box>
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
                <Card sx={{ bgcolor: secondaryColor, color: "white", p: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AssignmentIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h6">Active Leads</Typography>
                    </Box>
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
                <Card sx={{ bgcolor: "success.main", color: "white", p: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TaskIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h6">Active Tasks</Typography>
                    </Box>
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
                <Card sx={{ bgcolor: "info.main", color: "white", p: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h6">Total Payments</Typography>
                    </Box>
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

            {/* Creative Policy Info Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Top Companies */}
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, minHeight: 160, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ color: '#1976d2', fontSize: 28, mr: 1 }} />
                      <Typography variant="subtitle1" color="primary" fontWeight={700} gutterBottom>Top Companies</Typography>
                    </Box>
                    {topCompanies.length === 0 ? (
                      <Typography variant="body2">No data</Typography>
                    ) : (
                      topCompanies.map(tc => (
                        <Tooltip key={tc.company} title={tc.company} arrow>
                          <Box sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography variant="body2" fontWeight={600}>{tc.company}</Typography>
                            <Typography variant="caption" color="text.secondary">{tc.count} policies</Typography>
                          </Box>
                        </Tooltip>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
              {/* Recent Policies */}
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, minHeight: 160, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PolicyIcon sx={{ color: '#1976d2', fontSize: 28, mr: 1 }} />
                      <Typography variant="subtitle1" color="primary" fontWeight={700} gutterBottom>Recent Policies</Typography>
                    </Box>
                    {recentPolicies.length === 0 ? (
                      <Typography variant="body2">No recent policies</Typography>
                    ) : (
                      recentPolicies.map(p => (
                        <Tooltip key={p.id} title={p.policyNumber || 'N/A'} arrow>
                          <Box sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography variant="body2" fontWeight={600}>{p.policyNumber || 'N/A'}</Typography>
                            <Typography variant="caption" color="text.secondary">{p.type} • {p.startDate ? new Date(p.startDate).toLocaleDateString() : ''}</Typography>
                          </Box>
                        </Tooltip>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
              {/* Policy Status Breakdown */}
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, minHeight: 160, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimelineIcon sx={{ color: '#1976d2', fontSize: 28, mr: 1 }} />
                      <Typography variant="subtitle1" color="primary" fontWeight={700} gutterBottom>Status Breakdown</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {statusBreakdown.length === 0 ? (
                        <Typography variant="body2">No data</Typography>
                      ) : (
                        statusBreakdown.map(sb => (
                          <Chip key={sb.status} label={`${sb.status}: ${sb.count}`} color={sb.status === 'Live Policy' ? 'success' : sb.status === 'Lapsed' ? 'error' : 'warning'} variant="outlined" />
                        ))
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              {/* Upcoming Expirations */}
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 2, minHeight: 160, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 8 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventAvailableIcon sx={{ color: '#1976d2', fontSize: 28, mr: 1 }} />
                      <Typography variant="subtitle1" color="primary" fontWeight={700} gutterBottom>Upcoming Expirations</Typography>
                    </Box>
                    {upcomingExpirations.length === 0 ? (
                      <Typography variant="body2">No upcoming expirations</Typography>
                    ) : (
                      upcomingExpirations.map(p => (
                        <Tooltip key={p.id} title={p.policyNumber || 'N/A'} arrow>
                          <Box sx={{ mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography variant="body2" fontWeight={600}>{p.policyNumber || 'N/A'}</Typography>
                            <Typography variant="caption" color="text.secondary">{p.endDate ? new Date(p.endDate).toLocaleDateString() : ''}</Typography>
                          </Box>
                        </Tooltip>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
              {/* Policy Type Distribution */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Policy Distribution by Type
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyStats.typeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {policyStats.typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Policy Status Overview */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Policy Status Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={policyStats.statusDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Number of Policies" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Monthly Premium Collection */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Monthly Premium Collection
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={policyStats.monthlyPremiums}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#8884d8" 
                        name="Premium Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* New vs Renewal Business */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    New vs Renewal Business
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={policyStats.businessDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        name="Number of Policies"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
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
                    {departments.map((dept, idx) => (
                      <MenuItem key={`${dept}-${idx}`} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
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
                  >
                    {positions.map((pos, idx) => (
                      <MenuItem key={`${pos}-${idx}`} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                  </TextField>
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

                {/* Privilege toggle for admin only */}
                {isAdmin && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.role === 'privileged'}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              role: e.target.checked ? 'privileged' : 'standard'
                            }))
                          }
                          color="primary"
                        />
                      }
                      label="Privileged Employee (can manage policies, customers, commissions, analytics)"
                    />
                  </Grid>
                )}

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
                      "Privilege",
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {emp.position === 'Admin' ? (
                              <Chip
                                label="Admin"
                                color="error"
                                size="small"
                                sx={{ fontWeight: 'bold', border: '2px solid #d32f2f', background: '#fff0f0', color: '#d32f2f' }}
                              />
                            ) : emp.role === 'privileged' ? (
                              <Chip
                                label="Privileged"
                                color="success"
                                size="small"
                                sx={{ fontWeight: 'bold', border: '2px solid #4caf50' }}
                              />
                            ) : (
                              <Chip
                                label="Standard"
                                color="default"
                                size="small"
                              />
                            )}
                          </Box>
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
                            color="primary"
                            onClick={() => {
                              setEditEmployee(emp);
                              setEditModalOpen(true);
                            }}
                          >
                            Edit
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

        {/* Delete Confirmation Modal */}
        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
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
              Delete Employee
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete <strong>{selectedEmployee?.name}</strong>? This action cannot be undone.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => handleDeleteEmployee(selectedEmployee?.id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Edit Employee Modal */}
        {editModalOpen && (
          <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Edit Employee
              </Typography>
              <Typography sx={{ mb: 2 }}>
                {editEmployee?.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedEmployee(editEmployee);
                    setOpenModal(true);
                    setEditModalOpen(false);
                  }}
                >
                  Reset Password
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedEmployee(editEmployee);
                    setOpenDeleteModal(true);
                    setEditModalOpen(false);
                  }}
                >
                  Delete Employee
                </Button>
                {isAdmin && editEmployee?.position !== 'Admin' && (
                  <Button
                    variant="outlined"
                    color={editEmployee.role === 'privileged' ? 'warning' : 'success'}
                    onClick={() => {
                      handlePrivilegeToggle(editEmployee);
                      setEditModalOpen(false);
                    }}
                  >
                    {editEmployee.role === 'privileged' ? 'Revoke Privilege' : 'Make Privileged'}
                  </Button>
                )}
                <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
              </Box>
            </Box>
          </Modal>
        )}
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