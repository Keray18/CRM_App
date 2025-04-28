import React, { useState } from "react";
import { 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import { Edit, Delete, Search, FilterList } from "@mui/icons-material";
import dayjs from "dayjs";
import { updatePolicy } from '../../services/policyService';

const Customers = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPolicy, setFilterPolicy] = useState("All");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Updated policy types to match creation form options
  const policyTypes = ["Vehicle", "Health", "Travel"];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterPolicy(e.target.value);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer.id);
    setEditForm({ ...customer });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      // Send all required fields, not just the edited ones
      await updatePolicy(editForm.id, {
        policyNumber: editForm.policyNumber,
        insuredName: editForm.name,
        mobile: editForm.phone,
        email: editForm.email,
        startDate: editForm.conversionDate,
        endDate: editForm.endDate,
        company: editForm.company,
        business: editForm.business,
        type: editForm.policy,
        status: editForm.status,
      });

      setCustomers(customers.map(c =>
        c.id === editForm.id ? { ...editForm } : c
      ));
      setSnackbar({ open: true, message: "Customer updated successfully", severity: "success" });
      setEditingCustomer(null);
      setEditForm({});
    } catch (error) {
      console.error("Update error:", error);
      setSnackbar({ open: true, message: "Failed to update customer in database", severity: "error" });
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setEditForm({});
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    setSnackbar({ open: true, message: "Customer deleted successfully", severity: "info" });
  };

  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       customer.phone.includes(searchTerm) ||
                       customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPolicy === "All" || customer.policy === filterPolicy;
    return matchesSearch && matchesFilter;
  }) : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "primary.main" }}>
        Customer Management
      </Typography>

      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder="Search customers..."
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ 
            minWidth: 200,
            flexGrow: 1,
            backgroundColor: "white",
            borderRadius: 1,
            "& .MuiInputLabel-root": { color: "black" },
            "& .MuiOutlinedInput-root": { color: "black" }
          }}
        />
        <TextField
          select
          variant="outlined"
          label="Filter by Policy"
          value={filterPolicy}
          onChange={handleFilterChange}
          sx={{ 
            minWidth: 200,
            backgroundColor: "white",
            borderRadius: 1,
            "& .MuiInputLabel-root": { color: "black" },
            "& .MuiOutlinedInput-root": { color: "black" }
          }}
          InputProps={{ startAdornment: <FilterList sx={{ mr: 1 }} /> }}
        >
          <MenuItem value="All">All Policies</MenuItem>
          {policyTypes.map(policy => (
            <MenuItem key={policy} value={policy}>{policy}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.light" }}>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell>Conversion Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredCustomers) && filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No customers found</TableCell>
              </TableRow>
            ) : (
              Array.isArray(filteredCustomers) && filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography fontWeight="bold">{customer.name}</Typography>
                    {editingCustomer === customer.id && (
                      <TextField
                        fullWidth
                        size="small"
                        value={editForm.name}
                        onChange={(e) => handleEditFormChange('name', e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <div>{customer.phone}</div>
                      {customer.email && <div style={{ fontSize: '0.8rem', color: '#666' }}>{customer.email}</div>}
                    </Box>
                    {editingCustomer === customer.id && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          value={editForm.phone}
                          onChange={(e) => handleEditFormChange('phone', e.target.value)}
                          sx={{ mt: 1 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          value={editForm.email || ''}
                          onChange={(e) => handleEditFormChange('email', e.target.value)}
                          sx={{ mt: 1 }}
                        />
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCustomer === customer.id ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={editForm.policy}
                        onChange={(e) => handleEditFormChange('policy', e.target.value)}
                      >
                        {policyTypes.map(policy => (
                          <MenuItem key={policy} value={policy}>{policy}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Chip 
                        label={customer.policy} 
                        size="small" 
                        color={
                          customer.policy === "Vehicle" ? "primary" :
                          customer.policy === "Health" ? "success" :
                          customer.policy === "Travel" ? "info" : "default"
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCustomer === customer.id ? (
                      <TextField
                        type="date"
                        fullWidth
                        size="small"
                        value={editForm.conversionDate}
                        onChange={(e) => handleEditFormChange('conversionDate', e.target.value)}
                      />
                    ) : (
                      customer.conversionDate
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.status || "Unknown"} 
                      size="small" 
                      color={
                        customer.status === "Active"
                          ? "success"
                          : customer.status === "Pending"
                          ? "warning"
                          : customer.status === "Lapsed"
                          ? "default"
                          : "error"
                      }
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    {editingCustomer === customer.id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Tooltip title="Edit Customer">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Customer">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;