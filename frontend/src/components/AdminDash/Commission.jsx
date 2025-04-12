import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Box,
  InputAdornment,
} from '@mui/material';
import { 
  Payment as PaymentIcon, 
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

function Commission() {
  const [activeTab, setActiveTab] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    commissionRate: '',
    policyType: '',
    effectiveDate: '',
  });
  const [paymentForm, setPaymentForm] = useState({
    companyName: '',
    amount: '',
    paymentDate: '',
    paymentMethod: '',
    referenceNumber: '',
    status: 'Pending',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Sample data - Replace with API calls in production
  useEffect(() => {
    const sampleCommissions = [
      {
        id: 1,
        companyName: 'ABC Insurance',
        commissionRate: '15%',
        policyType: 'Life Insurance',
        effectiveDate: '2024-01-01',
        status: 'Active',
        totalEarnings: 15000,
        pendingPayments: 5000,
      },
      {
        id: 2,
        companyName: 'XYZ Insurance',
        commissionRate: '12%',
        policyType: 'Health Insurance',
        effectiveDate: '2024-02-01',
        status: 'Active',
        totalEarnings: 12000,
        pendingPayments: 3000,
      },
    ];

    const samplePayments = [
      {
        id: 1,
        companyName: 'ABC Insurance',
        amount: 5000,
        paymentDate: '2024-03-01',
        paymentMethod: 'Bank Transfer',
        referenceNumber: 'PAY-001',
        status: 'Completed',
      },
      {
        id: 2,
        companyName: 'XYZ Insurance',
        amount: 3000,
        paymentDate: '2024-03-15',
        paymentMethod: 'Cheque',
        referenceNumber: 'PAY-002',
        status: 'Pending',
      },
    ];

    setCommissions(sampleCommissions);
    setPayments(samplePayments);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (commission = null) => {
    if (commission) {
      setSelectedCommission(commission);
      setFormData(commission);
    } else {
      setSelectedCommission(null);
      setFormData({
        companyName: '',
        commissionRate: '',
        policyType: '',
        effectiveDate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleOpenPaymentDialog = (payment = null) => {
    if (payment) {
      setSelectedPayment(payment);
      setPaymentForm(payment);
    } else {
      setSelectedPayment(null);
      setPaymentForm({
        companyName: '',
        amount: '',
        paymentDate: '',
        paymentMethod: '',
        referenceNumber: '',
        status: 'Pending',
      });
    }
    setOpenPaymentDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCommission(null);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    setSelectedPayment(null);
  };

  const handleSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.map(comm => 
        comm.id === selectedCommission.id ? { ...formData, id: comm.id } : comm
      ));
    } else {
      const newCommission = {
        ...formData,
        id: commissions.length + 1,
        status: 'Active',
        totalEarnings: 0,
        pendingPayments: 0,
      };
      setCommissions([...commissions, newCommission]);
    }
    handleCloseDialog();
  };

  const handlePaymentSubmit = () => {
    if (selectedPayment) {
      setPayments(payments.map(pay => 
        pay.id === selectedPayment.id ? { ...paymentForm, id: pay.id } : pay
      ));
      
      setCommissions(commissions.map(comm => {
        if (comm.companyName === paymentForm.companyName) {
          const updatedPendingPayments = comm.pendingPayments - (paymentForm.amount - (selectedPayment?.amount || 0));
          const updatedTotalEarnings = comm.totalEarnings + (paymentForm.amount - (selectedPayment?.amount || 0));
          return {
            ...comm,
            pendingPayments: Math.max(0, updatedPendingPayments),
            totalEarnings: updatedTotalEarnings
          };
        }
        return comm;
      }));
    } else {
      const newPayment = {
        ...paymentForm,
        id: payments.length + 1,
      };
      setPayments([...payments, newPayment]);
      
      setCommissions(commissions.map(comm => {
        if (comm.companyName === paymentForm.companyName) {
          const updatedPendingPayments = comm.pendingPayments - paymentForm.amount;
          const updatedTotalEarnings = comm.totalEarnings + paymentForm.amount;
          return {
            ...comm,
            pendingPayments: Math.max(0, updatedPendingPayments),
            totalEarnings: updatedTotalEarnings
          };
        }
        return comm;
      }));
    }
    handleClosePaymentDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value,
    }));
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

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCompany || commission.companyName === filterCompany;
    return matchesSearch && matchesFilter;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !filterCompany || payment.companyName === filterCompany;
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  return (
    <Box sx={{ 
      padding: '20px',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#000000'
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#000000', fontWeight: 'bold' }}>
        Commission & Payment Management
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            color: '#000000',
            '&.Mui-selected': {
              color: '#1976d2',
            },
          },
        }}
      >
        <Tab label="Commission Agreements" icon={<MoneyIcon />} />
        <Tab label="Payment History" icon={<PaymentIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ backgroundColor: '#ffffff' }}>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Companies"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000000' }}>Filter by Company</InputLabel>
                <Select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  label="Filter by Company"
                  sx={{ color: '#000000' }}
                >
                  <MenuItem value="">All Companies</MenuItem>
                  {commissions.map(commission => (
                    <MenuItem key={commission.id} value={commission.companyName}>
                      {commission.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            style={{ marginBottom: '20px' }}
          >
            Add New Commission Agreement
          </Button>

          <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Company Name</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Commission Rate</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Policy Type</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Effective Date</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Total Earnings</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Pending Payments</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell sx={{ color: '#000000' }}>{commission.companyName}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{commission.commissionRate}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{commission.policyType}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{commission.effectiveDate}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>₹{commission.totalEarnings.toLocaleString('en-IN')}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>₹{commission.pendingPayments.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={commission.status} 
                        color={commission.status === 'Active' ? 'success' : 'default'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDialog(commission)}
                        sx={{ mr: 1, color: '#000000', borderColor: '#000000' }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleOpenPaymentDialog({ companyName: commission.companyName })}
                      >
                        Add Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ backgroundColor: '#ffffff' }}>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Payments"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000000' }}>Filter by Company</InputLabel>
                <Select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  label="Filter by Company"
                  sx={{ color: '#000000' }}
                >
                  <MenuItem value="">All Companies</MenuItem>
                  {commissions.map(commission => (
                    <MenuItem key={commission.id} value={commission.companyName}>
                      {commission.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000000' }}>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Filter by Status"
                  sx={{ color: '#000000' }}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenPaymentDialog()}
            style={{ marginBottom: '20px' }}
          >
            Add New Payment
          </Button>

          <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Company Name</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Payment Date</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Payment Method</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Reference Number</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell sx={{ color: '#000000' }}>{payment.companyName}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{payment.paymentDate}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{payment.paymentMethod}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{payment.referenceNumber}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status} 
                        color={getStatusColor(payment.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenPaymentDialog(payment)}
                        sx={{ color: '#000000', borderColor: '#000000' }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            color: '#000000'
          }
        }}
      >
        <DialogTitle sx={{ color: '#000000' }}>
          {selectedCommission ? 'Edit Commission Agreement' : 'Add New Commission Agreement'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Commission Rate (%)"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Policy Type"
                name="policyType"
                value={formData.policyType}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Effective Date"
                name="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#000000' }}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedCommission ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openPaymentDialog} 
        onClose={handleClosePaymentDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            color: '#000000'
          }
        }}
      >
        <DialogTitle sx={{ color: '#000000' }}>
          {selectedPayment ? 'Edit Payment' : 'Add New Payment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000000' }}>Company Name</InputLabel>
                <Select
                  name="companyName"
                  value={paymentForm.companyName}
                  onChange={handlePaymentInputChange}
                  label="Company Name"
                  sx={{ color: '#000000' }}
                >
                  {commissions.map(commission => (
                    <MenuItem key={commission.id} value={commission.companyName}>
                      {commission.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount (₹)"
                name="amount"
                type="number"
                value={paymentForm.amount}
                onChange={handlePaymentInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={paymentForm.paymentDate}
                onChange={handlePaymentInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000000' }}>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={paymentForm.paymentMethod}
                  onChange={handlePaymentInputChange}
                  label="Payment Method"
                  sx={{ color: '#000000' }}
                >
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Online Payment">Online Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference Number"
                name="referenceNumber"
                value={paymentForm.referenceNumber}
                onChange={handlePaymentInputChange}
                sx={{ 
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiOutlinedInput-root': { color: '#000000' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#000000' }}>Status</InputLabel>
                <Select
                  name="status"
                  value={paymentForm.status}
                  onChange={handlePaymentInputChange}
                  label="Status"
                  sx={{ color: '#000000' }}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog} sx={{ color: '#000000' }}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} color="primary">
            {selectedPayment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Commission;
