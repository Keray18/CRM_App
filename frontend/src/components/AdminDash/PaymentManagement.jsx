import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config/config';

function PaymentManagement({ policies: propPolicies }) {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState(propPolicies || []);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    policyId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
    paymentType: 'Full',
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
    if (!propPolicies) {
      fetchPolicies();
    }
  }, []);

  useEffect(() => {
    if (propPolicies) {
      setPolicies(propPolicies);
    }
  }, [propPolicies]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments`);
      setPayments(response.data);
    } catch (error) {
      showSnackbar('Error fetching payments', 'error');
    }
  };

  const fetchPolicies = async () => {
    try {
      const response = await axios.get(`${API_URL}/policies`);
      setPolicies(response.data);
    } catch (error) {
      showSnackbar('Error fetching policies', 'error');
    }
  };

  const handleOpenDialog = (payment = null) => {
    console.log('Opening dialog with payment:', payment); // Debugging
    if (payment) {
      setSelectedPayment(payment);
      setFormData({
        policyId: payment.policyId,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        referenceNumber: payment.referenceNumber,
        paymentType: payment.paymentType,
        notes: payment.notes || ''
      });
    } else {
      setSelectedPayment(null);
      setFormData({
        policyId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        referenceNumber: '',
        paymentType: 'Full',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const remainingPayment = calculateRemainingPayment(formData.policyId);

    if (remainingPayment === 0) {
      showSnackbar('This policy is already fully paid!', 'error');
      return;
    }

    if (formData.amount > remainingPayment) {
      showSnackbar('Payment amount exceeds the remaining balance!', 'error');
      return;
    }

    try {
      if (selectedPayment && selectedPayment.id) {
        // Use the correct ID for the PUT request
        await axios.put(`${API_URL}/payments/${selectedPayment.id}`, formData);
        showSnackbar('Payment updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}/payments`, formData);
        showSnackbar('Payment created successfully', 'success');
      }
      handleCloseDialog();
      fetchPayments();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving payment', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`${API_URL}/payments/${id}`);
        showSnackbar('Payment deleted successfully', 'success');
        fetchPayments();
      } catch (error) {
        showSnackbar('Error deleting payment', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getPolicyDetails = (policyId) => {
    const policy = policies.find(p => p.id === policyId);
    return policy ? `${policy.policyNumber} - ${policy.insuredName}` : 'Unknown Policy';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateRemainingPayment = (policyId) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return 0;

    const totalPaid = payments
      .filter(payment => payment.policyId === policyId)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return Math.max(policy.totalPremium - totalPaid, 0); // Ensure it doesn't go below 0
  };

  const aggregatePaymentsByPolicy = () => {
    return policies
      .filter(policy => {
        // Include only policies that have payments
        const totalPaid = payments
          .filter(payment => payment.policyId === policy.id)
          .reduce((sum, payment) => sum + payment.amount, 0);
        return totalPaid > 0; // Only include policies with payments
      })
      .map(policy => {
        const totalPaid = payments
          .filter(payment => payment.policyId === policy.id)
          .reduce((sum, payment) => sum + payment.amount, 0);

        return {
          policyId: policy.id,
          policyDetails: `${policy.policyNumber} - ${policy.insuredName}`,
          totalPremium: policy.totalPremium,
          totalPaid,
          remainingPayment: Math.max(policy.totalPremium - totalPaid, 0)
        };
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Payment Management
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ backgroundColor: '#1976d2', color: '#fff' }}
              >
                Add Payment
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'black',
                color: 'black',
                overflowX: 'auto',
                maxWidth: '100%',
                marginTop: 2, // Add margin at the top
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '14px', fontWeight: 'bold', backgroundColor: 'black' }}>
                      Policy
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'black' }}>Total Paid</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'black' }}>Remaining Payment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'black' }}>Total Premium</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'black' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aggregatePaymentsByPolicy().length > 0 ? (
                    aggregatePaymentsByPolicy()
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((policy, index) => (
                        <TableRow
                          key={policy.policyId}
                          sx={{
                            backgroundColor: 'black',
                            '&:hover': { backgroundColor: 'burlywood' },
                          }}
                        >
                          <TableCell>{policy.policyDetails}</TableCell>
                          <TableCell>₹{policy.totalPaid.toLocaleString('en-IN')}</TableCell>
                          <TableCell>₹{policy.remainingPayment.toLocaleString('en-IN')}</TableCell>
                          <TableCell>₹{policy.totalPremium.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <Tooltip title="Add Payment">
                              <IconButton onClick={() => handleOpenDialog({ policyId: policy.policyId })}>
                                <AddIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No payments have been made yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={aggregatePaymentsByPolicy().length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: 'black', fontWeight: 'bold' }}>
            {selectedPayment ? 'Edit Payment' : 'Add New Payment'}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Policy</InputLabel>
                    <Select
                      name="policyId"
                      value={formData.policyId}
                      onChange={handleInputChange}
                      label="Policy"
                    >
                      {policies.map((policy) => (
                        <MenuItem key={policy.id} value={policy.id}>
                          {policy.policyNumber} - {policy.insuredName} (₹{policy.totalPremium.toLocaleString('en-IN')})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payment Date"
                    name="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleInputChange}
                      label="Payment Type"
                    >
                      <MenuItem value="Full">Full Payment</MenuItem>
                      <MenuItem value="Part">Part Payment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      label="Payment Method"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Cheque">Cheque</MenuItem>
                      <MenuItem value="Online Transfer">Online Transfer</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reference Number"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={2}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: 'gray' }}>
                    Remaining Payment: ₹{calculateRemainingPayment(formData.policyId).toLocaleString('en-IN')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedPayment ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default PaymentManagement;