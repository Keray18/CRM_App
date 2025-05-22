import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { Edit, Delete, Search, FilterList } from "@mui/icons-material";
import dayjs from "dayjs";
import { updatePolicy } from '../../services/policyService';
import { updateCustomer, deleteCustomer, getAllCustomers, createCustomer } from '../../services/customerService';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPolicy, setFilterPolicy] = useState("All");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    phone: '',
    email: '',
    policy: '',
    conversionDate: dayjs().format('YYYY-MM-DD'),
    status: 'Active',
  });
  const [creating, setCreating] = useState(false);

  // Updated policy types to match creation form options
  const policyTypes = ["Vehicle", "Health", "Travel"];
  const statusOptions = ["Active", "Inactive", "Pending"];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to fetch customers", severity: "error" });
      }
    };
    fetchCustomers();
  }, []);

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
      // Ensure conversionDate is always set and valid
      let conversionDate = editForm.conversionDate;
      if (!conversionDate) {
        conversionDate = dayjs().format("YYYY-MM-DD");
      }

      await updateCustomer(editForm.id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        policy: editForm.policy,
        conversionDate, // always send a valid date
        status: editForm.status || "Active",
      });

      setCustomers(customers.map(c =>
        c.id === editForm.id ? { ...editForm, conversionDate, status: editForm.status || "Active" } : c
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

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCustomer(customerToDelete.id);
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      setSnackbar({ open: true, message: "Customer and associated policies deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({ open: true, message: error.message || "Failed to delete customer", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleCreateFormChange = (field, value) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCustomer = async () => {
    setCreating(true);
    try {
      const newCustomer = await createCustomer(createForm);
      setCustomers([newCustomer, ...customers]);
      setSnackbar({ open: true, message: 'Customer created successfully', severity: 'success' });
      setCreateDialogOpen(false);
      setCreateForm({
        name: '', phone: '', email: '', policy: '', conversionDate: dayjs().format('YYYY-MM-DD'), status: 'Active',
      });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to create customer', severity: 'error' });
    } finally {
      setCreating(false);
    }
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
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setCreateDialogOpen(true)}>
        + Add Customer
      </Button>

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
                <TableRow key={customer.id}>
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
                    {editingCustomer === customer.id ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={editForm.status || "Active"}
                        onChange={(e) => handleEditFormChange('status', e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        {statusOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Chip 
                        label={customer.status || "Unknown"} 
                        size="small" 
                        color={
                          customer.status === "Active"
                            ? "success"
                            : customer.status === "Pending"
                            ? "warning"
                            : customer.status === "Inactive"
                            ? "default"
                            : "error"
                        }
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      />
                    )}
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
                            onClick={() => handleDeleteClick(customer)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create Customer</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={createForm.name} onChange={e => handleCreateFormChange('name', e.target.value)} required />
          <TextField label="Phone" fullWidth margin="dense" value={createForm.phone} onChange={e => handleCreateFormChange('phone', e.target.value)} required />
          <TextField label="Email" fullWidth margin="dense" value={createForm.email} onChange={e => handleCreateFormChange('email', e.target.value)} />
          <TextField select label="Policy" fullWidth margin="dense" value={createForm.policy} onChange={e => handleCreateFormChange('policy', e.target.value)} required>
            {policyTypes.map(policy => <MenuItem key={policy} value={policy}>{policy}</MenuItem>)}
          </TextField>
          <TextField label="Conversion Date" type="date" fullWidth margin="dense" value={createForm.conversionDate} onChange={e => handleCreateFormChange('conversionDate', e.target.value)} InputLabelProps={{ shrink: true }} required />
          <TextField select label="Status" fullWidth margin="dense" value={createForm.status} onChange={e => handleCreateFormChange('status', e.target.value)}>
            {statusOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCustomer} variant="contained" color="primary" disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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