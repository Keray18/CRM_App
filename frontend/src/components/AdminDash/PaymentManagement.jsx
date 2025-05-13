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
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon
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
    try {
      if (selectedPayment) {
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Payment List</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Payment
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Policy</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Payment Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{getPolicyDetails(payment.policyId)}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.paymentType}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenDialog(payment)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(payment.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPayment ? 'Edit Payment' : 'Add New Payment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
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
    </Box>
  );
}

export default PaymentManagement; 