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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import { styled } from "@mui/material/styles";

const primaryColor = "#1976d2";
const secondaryColor = "#f50057";
const backgroundColor = "#f5f5f5";

// Styled components using MUI's styled API
// This component is responsible for styling the sidebar drawer

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    backgroundColor: primaryColor,
    color: "#fff",
    width: 240,
    transition: "all 0.3s ease",
  },
});

// Sidebar component
// This component is responsible for rendering the sidebar navigation menu

const Sidebar = ({ section, setSection }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Register Employee", icon: <PersonAddIcon /> },
    { text: "Manage Employees", icon: <PeopleIcon /> },
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

// Password generation function
// This function generates a random password for the employee
// It uses Math.random() to create a random string of characters
const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// Dashboard component
// This component is responsible for rendering the main dashboard content
// It includes sections for employee registration and management
// It uses Material-UI components for styling and layout

const Dashboard = () => {
  const [section, setSection] = useState("Dashboard");
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    policyNumber: "",
    password: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newEmployee = { ...formData, password: generatePassword() };
    setEmployees([...employees, newEmployee]);
    setFormData({
      name: "",
      phone: "",
      email: "",
      position: "",
      department: "",
      policyNumber: "",
      password: "",
    });
  };

  const handlePasswordClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

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

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: backgroundColor,
        minHeight: "100vh",
      }}
    >
      <Sidebar section={section} setSection={setSection} />
      <Box component="main" sx={{ flexGrow: 1, p: 4, pl: 35,backgroundColor:"black", color: "White" }}>
        {/* <Typography variant="h4" fontWeight="bold" gutterBottom>Welcome to the Admin Panel</Typography> */}
        {section === "Dashboard" && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dashboard Overview
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    backgroundColor: primaryColor,
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Employees
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {employees.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {section === "Register Employee" && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Employee Registration
            </Typography>
            <Box
              sx={{
                backgroundColor: "#252525",
                p: 4,
                borderRadius: 3,
                boxShadow: 2,
                maxWidth: 600,
                mx: "auto",
                // border: "1px solid #ddd",
                mt: 8,
                display: "flex",
                flexDirection: "column",
                gap: 2, // Proper spacing between inputs
              }}
            >
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Position"
                variant="outlined"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Department"
                variant="outlined"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Policy Number"
                variant="outlined"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  bgcolor: primaryColor,
                  "&:hover": { bgcolor: "#1565c0" },
                }}
                onClick={handleSubmit}
              >
                Register Employee
              </Button>
            </Box>
          </>
        )}

        {section === "Manage Employees" && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Employee Management
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                "& .MuiTableHead-root": { bgcolor: "white", },
                "& .MuiTableCell-root": { py: 2 ,color: "black"},
              }}
            >
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Policy Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Password</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((emp, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: "white" ,
                        // "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.phone}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.policyNumber}</TableCell>
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          color: primaryColor,
                          fontWeight: 500,
                          textDecoration: "underline",
                          "&:hover": { color: secondaryColor },
                        }}
                        onClick={() => handlePasswordClick(emp)}
                      >
                        {emp.password}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 400,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: primaryColor, fontWeight: "bold" }}
          >
            Reset Password
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to reset the password for
            <br />
            <strong>{selectedEmployee?.name}</strong>?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handlePasswordReset}
              sx={{ bgcolor: primaryColor, "&:hover": { bgcolor: "#1565c0" } }}
            >
              Confirm Reset
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
              sx={{ borderColor: primaryColor, color: primaryColor }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
