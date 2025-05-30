import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
  Avatar,
  Divider,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Policy as PolicyIcon,
  ExitToApp as LogoutIcon,
  People as LeadsIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from 'axios';
import { API_URL } from '../config/config';
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
  ResponsiveContainer,
} from "recharts";
import authHeader from '../services/authHeader';

// Import the components
import MyTasks from "./EmpDashboard/MyTasks";
import MyDocuments from "./EmpDashboard/MyDocuments";
import MyPolicies from "./EmpDashboard/MyPolicies";
import MyLeads from "./EmpDashboard/MyLeads";

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    backgroundColor: "#0C47A0",
    color: "#fff",
    width: 240,
    transition: "all 0.3s ease",
  },
});

const Sidebar = ({ section, setSection, name }) => {
  const role = localStorage.getItem('role'); // 'privileged' or 'standard'
  const isPrivileged = role === 'privileged';

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "My Tasks", icon: <TaskIcon /> },
    { text: "My Documents", icon: <DocumentIcon /> },
    { text: "My Policies", icon: <PolicyIcon /> },
    { text: "My Leads", icon: <LeadsIcon /> },
    { text: "Payments", icon: <MoneyIcon /> },
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          {name ? `Welcome ${name}` : 'Employee Portal'}
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

const EmpDashboard = () => {
  const [section, setSection] = useState("Dashboard");
  const navigate = useNavigate();
  const theme = useTheme();

  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState(0);

  // State for policies
  const [policies, setPolicies] = useState([]);
  const [activePolicies, setActivePolicies] = useState(0);

  // State for documents
  const [documents, setDocuments] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // State for leads
  const [leads, setLeads] = useState([]);
  const [activeLeads, setActiveLeads] = useState(0);

  // State for payments
  const [payments, setPayments] = useState([]);

  // Get employee name and id from localStorage
  const employeeName = localStorage.getItem('employeeName') || '';
  const employeeId = localStorage.getItem('employeeId') || '';

  // Get the role at the top of EmpDashboard
  const role = localStorage.getItem('role'); // 'privileged' or 'standard'
  const isPrivileged = role === 'privileged';

  // Fetch tasks for the employee
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks/employee/${employeeId}`, {
        headers: authHeader(),
        withCredentials: true
      });
      
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
        // Count only pending tasks
        setPendingTasks(response.data.tasks.filter(task => task.status === 'Pending').length);
      } else {
        setTasks([]);
        setPendingTasks(0);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setPendingTasks(0);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTasks();

    // Fetch policies
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${API_URL}/policies`, {
          headers: authHeader(),
          withCredentials: true
        });
        setPolicies(response.data || []);
        setActivePolicies((response.data || []).filter(policy => policy.status === 'Active').length);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    // Fetch documents
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${API_URL}/documents`, {
          headers: authHeader(),
          withCredentials: true
        });
        setDocuments(response.data || []);
        setTotalDocuments((response.data || []).length);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    // Fetch leads
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_URL}/leads`, {
          headers: authHeader(),
          withCredentials: true
        });
        setLeads(response.data.leads || []);
        setActiveLeads((response.data.leads || []).filter(lead => lead.status === 'Active').length);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    // Fetch payments
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/payments`, { headers: authHeader(), withCredentials: true });
        setPayments(response.data.payments || []);
      } catch (error) {
        setPayments([]);
      }
    };

    // Call all fetch functions
    fetchPolicies();
    fetchDocuments();
    fetchLeads();
    fetchPayments();
  }, [employeeId, isPrivileged, section]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const renderSection = () => {
    switch (section) {
      case "My Tasks":
        return <MyTasks employeeId={employeeId} employeeName={employeeName} onTaskUpdate={fetchTasks} />;
      case "My Documents":
        return <MyDocuments leads={leads} />;
      case "My Policies":
        return <MyPolicies policies={policies} setPolicies={setPolicies} />;
      case "My Leads":
        return <MyLeads leads={leads} setLeads={setLeads} />;
      case "Payments":
        if (!isPrivileged) return null;
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
              Payments
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No payments found</TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>{payment.companyName}</TableCell>
                        <TableCell>₹{payment.amount}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={payment.status === 'Completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      default:
        return (
          <Box>
            {/* Summary Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TaskIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Pending Tasks
                      </Typography>
                    </Box>
                    <Typography variant="h3">
                      {pendingTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ 
                  bgcolor: theme.palette.secondary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PolicyIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Active Policies
                      </Typography>
                    </Box>
                    <Typography variant="h3">
                      {activePolicies}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ 
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.success.dark,
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DocumentIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Documents
                      </Typography>
                    </Box>
                    <Typography variant="h3">
                      {totalDocuments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      color: "#000000"
    }}>
      <Sidebar section={section} setSection={setSection} name={employeeName} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 4, pl: 35 }}>
        {/* Header */}
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
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Content */}
        {renderSection()}
      </Box>
    </Box>
  );
};

export default EmpDashboard; 