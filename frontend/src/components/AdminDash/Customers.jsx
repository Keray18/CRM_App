import React,{useState} from "react";
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

const Customers = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPolicy, setFilterPolicy] = useState("All");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const policyTypes = ["Life Insurance", "Health Insurance", "Auto Insurance", "Home Insurance", "Travel Insurance"];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterPolicy(e.target.value);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  const handleSaveEdit = () => {
    setCustomers(customers.map(c => 
      c.id === editingCustomer.id ? editingCustomer : c
    ));
    setSnackbar({ open: true, message: "Customer updated successfully", severity: "success" });
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    setSnackbar({ open: true, message: "Customer deleted successfully", severity: "info" });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.phone.includes(searchTerm) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPolicy === "All" || customer.policy === filterPolicy;
    return matchesSearch && matchesFilter;
  });

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
            "& .MuiInputLabel-root": { color: "black" }, // Label color
            "& .MuiOutlinedInput-root": { color: "black" } // Text color
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
            "& .MuiInputLabel-root": { color: "black" }, // Label color
            "& .MuiOutlinedInput-root": { color: "black" } // Text color
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
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No customers found</TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography fontWeight="bold">{customer.name}</Typography>
                    {editingCustomer?.id === customer.id && (
                      <TextField
                        fullWidth
                        size="small"
                        value={editingCustomer.name}
                        onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <div>{customer.phone}</div>
                      {customer.email && <div style={{ fontSize: '0.8rem', color: '#666' }}>{customer.email}</div>}
                    </Box>
                    {editingCustomer?.id === customer.id && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          value={editingCustomer.phone}
                          onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                          sx={{ mt: 1 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          value={editingCustomer.email || ''}
                          onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                          sx={{ mt: 1 }}
                        />
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCustomer?.id === customer.id ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={editingCustomer.policy}
                        onChange={(e) => setEditingCustomer({...editingCustomer, policy: e.target.value})}
                      >
                        {policyTypes.map(policy => (
                          <MenuItem key={policy} value={policy}>{policy}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      customer.policy || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {dayjs(customer.conversionDate || customer.date).format('MMM D, YYYY')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small"
                      sx={{ color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>
                    {editingCustomer?.id === customer.id ? (
                      <Button 
                        variant="contained" 
                        size="small" 
                        color="primary"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Tooltip title="Edit customer">
                          <IconButton color="primary" onClick={() => handleEditCustomer(customer)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete customer">
                          <IconButton color="error" onClick={() => handleDeleteCustomer(customer.id)}>
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

      {/* Stats Summary */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 150, backgroundColor: "primary.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Total Customers</Typography>
            <Typography variant="h4">{customers.length}</Typography>
          </CardContent>
        </Card>
        {policyTypes.map(policy => {
          const count = customers.filter(c => c.policy === policy).length;
          if (count === 0) return null;
          return (
            <Card key={policy} sx={{ minWidth: 150 }}>
              <CardContent>
                <Typography variant="subtitle1">{policy}</Typography>
                <Typography variant="h5">{count}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;