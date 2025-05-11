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
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "My Tasks", icon: <TaskIcon /> },
    { text: "My Documents", icon: <DocumentIcon /> },
    { text: "My Policies", icon: <PolicyIcon /> },
    { text: "My Leads", icon: <LeadsIcon /> },
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

  // State for commissions
  const [commissions, setCommissions] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);

  // Get employee name and id from localStorage
  const employeeName = localStorage.getItem('employeeName') || '';
  const employeeId = localStorage.getItem('employeeId') || '';

  // Fetch data on component mount
  useEffect(() => {
    // Fetch tasks
    const fetchTasks = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
        setPendingTasks(data.filter(task => task.status === 'Pending').length);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    // Fetch policies
    const fetchPolicies = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/policies');
        const data = await response.json();
        setPolicies(data);
        setActivePolicies(data.filter(policy => policy.status === 'Active').length);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    // Fetch documents
    const fetchDocuments = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/documents');
        const data = await response.json();
        setDocuments(data);
        setTotalDocuments(data.length);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    // Fetch leads
    const fetchLeads = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/leads');
        const data = await response.json();
        setLeads(data);
        setActiveLeads(data.filter(lead => lead.status === 'Active').length);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    // Fetch commissions
    const fetchCommissions = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/commissions');
        const data = await response.json();
        setCommissions(data);
        const total = data.reduce((sum, comm) => sum + parseFloat(comm.amount), 0);
        setTotalCommission(total);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      }
    };

    // Call all fetch functions
    fetchTasks();
    fetchPolicies();
    fetchDocuments();
    fetchLeads();
    fetchCommissions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const renderSection = () => {
    switch (section) {
      case "My Tasks":
        return <MyTasks employeeId={employeeId} employeeName={employeeName} />;
      case "My Documents":
        return <MyDocuments documents={documents} setDocuments={setDocuments} />;
      case "My Policies":
        return <MyPolicies policies={policies} setPolicies={setPolicies} />;
      case "My Leads":
        return <MyLeads leads={leads} setLeads={setLeads} />;
      default:
        // Prepare data for charts
        const commissionByMonth = [
          { month: 'Jan', amount: 25000 },
          { month: 'Feb', amount: 30000 },
          { month: 'Mar', amount: 28000 },
          { month: 'Apr', amount: 35000 },
          { month: 'May', amount: 32000 },
          { month: 'Jun', amount: 40000 },
        ];

        const policyTypeDistribution = [
          { name: 'Health', value: 40 },
          { name: 'Life', value: 25 },
          { name: 'Vehicle', value: 20 },
          { name: 'Property', value: 15 },
        ];

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
              <Grid item xs={12} md={3}>
                <Card sx={{ 
                  bgcolor: theme.palette.warning.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.warning.dark,
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Total Commission
                      </Typography>
                    </Box>
                    <Typography variant="h3">
                      ₹{totalCommission.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Commission Trend */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Commission Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={commissionByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#8884d8" 
                        name="Commission Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Policy Type Distribution */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Policy Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {policyTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Commission Details Table */}
            <Paper sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Recent Commission Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Policy Number</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>Policy Type</TableCell>
                      <TableCell>Premium Amount</TableCell>
                      <TableCell>Commission %</TableCell>
                      <TableCell>Commission Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commissions.slice(0, 5).map((commission) => (
                      <TableRow key={commission.id} hover>
                        <TableCell>{commission.policyNumber}</TableCell>
                        <TableCell>{commission.clientName}</TableCell>
                        <TableCell>{commission.policyType}</TableCell>
                        <TableCell>₹{commission.premiumAmount.toLocaleString()}</TableCell>
                        <TableCell>{commission.commissionPercentage}%</TableCell>
                        <TableCell>₹{commission.commissionAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={commission.status}
                            color={commission.status === 'Paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
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