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
  TablePagination,
  Divider,
} from '@mui/material';
import { 
  Payment as PaymentIcon, 
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  MonetizationOn as MonetizationOnIcon,
  Description as PolicyIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { API_URL } from '../../config/config';
import axios from 'axios';
import { getAllPolicies } from '../../services/policyService';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import PaymentManagement from './PaymentManagement';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

function Commission() {
  const [activeTab, setActiveTab] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    policyType: '',
    tpCommission: '',
    odCommission: '',
    addonCommission: '',
    effectiveCommission: '',
    notes: '',
    isActive: true,
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
  const [companies, setCompanies] = useState([]);
  const [breakdownDialogOpen, setBreakdownDialogOpen] = useState(false);
  const [breakdownData, setBreakdownData] = useState([]);
  const [breakdownCompany, setBreakdownCompany] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [policySearch, setPolicySearch] = useState('');
  const [policyPage, setPolicyPage] = useState(0);
  const [policyRowsPerPage, setPolicyRowsPerPage] = useState(10);
  const [reportCompany, setReportCompany] = useState('');
  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');
  const [reportStats, setReportStats] = useState(null);

  // Fetch commissions from backend
  useEffect(() => {
    const fetchCommissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/commissions`);
        setCommissions(response.data);
      } catch (error) {
        setCommissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/masterdata/type/Insurance Company`)
      .then(res => setCompanies(res.data.filter(item => item.isActive).map(item => item.name)));
  }, []);

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/payments`);
        setPayments(response.data);
      } catch (error) {
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await getAllPolicies();
        setPolicies(data);
      } catch (error) {
        setPolicies([]);
      }
    };
    fetchPolicies();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (commission = null) => {
    if (commission) {
      setSelectedCommission(commission);
      setFormData({
        company: commission.company,
        policyType: commission.policyType,
        tpCommission: commission.tpCommission || '',
        odCommission: commission.odCommission || '',
        addonCommission: commission.addonCommission || '',
        effectiveCommission: commission.effectiveCommission || '',
        notes: commission.notes || '',
        isActive: commission.isActive,
      });
    } else {
      setSelectedCommission(null);
      setFormData({
        company: '',
        policyType: '',
        tpCommission: '',
        odCommission: '',
        addonCommission: '',
        effectiveCommission: '',
        notes: '',
        isActive: true,
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

  const handleSubmit = async () => {
    try {
    if (selectedCommission) {
        // Update
        const response = await axios.put(`${API_URL}/commissions/${selectedCommission.id}`, formData);
        setCommissions(commissions.map(comm => comm.id === selectedCommission.id ? response.data : comm));
    } else {
        // Create
        const response = await axios.post(`${API_URL}/commissions`, formData);
        setCommissions([...commissions, response.data]);
    }
    handleCloseDialog();
    } catch (error) {
      // Optionally show error
    }
  };

  const handlePaymentSubmit = async () => {
    try {
    if (selectedPayment) {
        // Update
        const response = await axios.put(`${API_URL}/payments/${selectedPayment.id}`, paymentForm);
        setPayments(payments.map(pay => pay.id === selectedPayment.id ? response.data : pay));
    } else {
        // Create
        const response = await axios.post(`${API_URL}/payments`, paymentForm);
        setPayments([...payments, response.data]);
      }
      handleClosePaymentDialog();
    } catch (error) {
      // Optionally show error
    }
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

  // Add delete logic
  const handleDeleteCommission = async (id) => {
    try {
      await axios.delete(`${API_URL}/commissions/${id}`);
      setCommissions(commissions.filter(comm => comm.id !== id));
    } catch (error) {
      // Optionally show error
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(`${API_URL}/payments/${id}`);
      setPayments(payments.filter(pay => pay.id !== id));
    } catch (error) {
      // Optionally show error
    }
  };

  const handleOpenBreakdown = async (company) => {
    setBreakdownCompany(company);
    setBreakdownDialogOpen(true);
    setBreakdownData([]);
    try {
      const res = await axios.get(`${API_URL}/commissions/breakdown/${encodeURIComponent(company)}`);
      setBreakdownData(res.data);
    } catch {
      setBreakdownData([]);
    }
  };

  const handleCloseBreakdown = () => {
    setBreakdownDialogOpen(false);
    setBreakdownData([]);
    setBreakdownCompany('');
  };

  const handleCompanyCardClick = (company) => {
    setSelectedCompany(company);
    setCompanyDialogOpen(true);
  };

  const handleCloseCompanyDialog = () => {
    setSelectedCompany(null);
    setCompanyDialogOpen(false);
  };

  const filteredCompanyPolicies = policies.filter(
    policy => policy.company === selectedCompany &&
      (
        policy.policyNumber?.toLowerCase().includes(policySearch.toLowerCase()) ||
        policy.insuredName?.toLowerCase().includes(policySearch.toLowerCase())
      )
  );
  const paginatedPolicies = filteredCompanyPolicies.slice(policyPage * policyRowsPerPage, policyPage * policyRowsPerPage + policyRowsPerPage);

  // Calculate company stats
  const companyStats = companies.map(company => {
    const companyPolicies = policies.filter(p => p.company === company);
    const numPolicies = companyPolicies.length;
    const totalCommission = companyPolicies.reduce((sum, p) => sum + (Number(p.totalCommissionAmount) || Number(p.commissionAmount) || 0), 0);
    const totalPremium = companyPolicies.reduce((sum, p) => sum + (Number(p.totalPremium) || Number(p.premium) || 0), 0);
    return { company, numPolicies, totalCommission, totalPremium };
  });

  // Bar chart data
  const barChartData = {
    labels: companyStats.map(stat => stat.company),
    datasets: [
      {
        label: 'Total Commission',
        data: companyStats.map(stat => stat.totalCommission),
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Total Commission by Company', color: '#1976d2', font: { size: 18 } },
    },
    scales: {
      x: { ticks: { color: '#1976d2', font: { weight: 'bold' } } },
      y: { ticks: { color: '#1976d2' } },
    },
  };

  const handleShowReport = () => {
    if (!reportCompany) return;
    const filtered = policies.filter(p =>
      p.company === reportCompany &&
      (!reportStart || new Date(p.startDate) >= new Date(reportStart)) &&
      (!reportEnd || new Date(p.endDate) <= new Date(reportEnd))
    );
    const totalCommission = filtered.reduce((sum, p) => sum + (Number(p.totalCommissionAmount) || Number(p.commissionAmount) || 0), 0);
    const totalPremium = filtered.reduce((sum, p) => sum + (Number(p.totalPremium) || Number(p.premium) || 0), 0);
    setReportStats({
      numPolicies: filtered.length,
      totalCommission,
      totalPremium
    });
  };

  // Calculate payment stats
  const totalPayments = payments.length;
  const totalPaid = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  function CommissionAgreementsTab() {
    return (
      <>
        {/* Place all Commission Agreements content here (dashboard, company cards, modal, etc.) */}
      </>
    );
  }

  function PaymentManagementTab() {
    return <PaymentManagement policies={policies} />;
  }

  function ReportsTab() {
    return (
      <Box sx={{ background: 'rgba(255,255,255,0.97)', borderRadius: 4, p: 4, boxShadow: 6, border: '2px solid #1976d2', mt: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 3, background: 'linear-gradient(90deg, #e3e3e3 0%, #fff 100%)', boxShadow: 3 }}>
              <BarChartIcon sx={{ fontSize: 48, color: '#1976d2', mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ color: '#111', fontWeight: 'bold', mb: 0.5 }}>Commission Reports</Typography>
                <Typography variant="body1" sx={{ color: '#333' }}>Generate and analyze commission and premium reports for any company and date range. Use the filters below to customize your report.</Typography>
              </Box>
            </Card>
          </Grid>
          <Divider sx={{ width: '100%', mb: 2, borderColor: '#1976d2', borderWidth: 2 }} />
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                value={reportCompany}
                onChange={e => setReportCompany(e.target.value)}
                label="Company"
                sx={{ color: '#111' }}
              >
                {companies.map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography sx={{ color: '#111', mb: 0.5 }}>Start Date</Typography>
            <input type="date" value={reportStart} onChange={e => setReportStart(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #bbb', color: '#111', background: '#fff' }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography sx={{ color: '#111', mb: 0.5 }}>End Date</Typography>
            <input type="date" value={reportEnd} onChange={e => setReportEnd(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #bbb', color: '#111', background: '#fff' }} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained" color="primary" fullWidth sx={{ height: '100%' }} onClick={handleShowReport}>Show Report</Button>
          </Grid>
        </Grid>
        {reportStats && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff 0%, #e3e3e3 100%)', borderRadius: 4, boxShadow: 6 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#111', fontWeight: 'bold' }}>Policies</Typography>
                  <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>{reportStats.numPolicies}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff 0%, #e3e3e3 100%)', borderRadius: 4, boxShadow: 6 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#111', fontWeight: 'bold' }}>Total Commission</Typography>
                  <Typography variant="h4" sx={{ color: '#388e3c', fontWeight: 'bold' }}>₹{reportStats.totalCommission.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff 0%, #e3e3e3 100%)', borderRadius: 4, boxShadow: 6 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#111', fontWeight: 'bold' }}>Total Premium</Typography>
                  <Typography variant="h4" sx={{ color: '#fbc02d', fontWeight: 'bold' }}>₹{reportStats.totalPremium.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: '20px',
      minHeight: '100vh',
      color: '#111',
      background: 'linear-gradient(120deg, #f5faff 0%, #e3f2fd 100%)',
    }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #111 30%, #333 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        Commission & Payment Management
      </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: '#111',
            '&.Mui-selected': {
              color: '#1976d2',
            },
          },
        }}
      >
        <Tab label="Commission Agreements" icon={<MoneyIcon />} />
        <Tab label="Payment Management" icon={<PaymentIcon />} />
        <Tab label="Reports" icon={<BarChartIcon />} />
      </Tabs>
      {activeTab === 0 && <CommissionAgreementsTab />}
      {activeTab === 1 && <PaymentManagementTab />}
      {activeTab === 2 && <ReportsTab />}
      {activeTab === 0 && (
        <>
          {/* Company Stats Dashboard */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {companyStats.map(stat => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={stat.company}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #fff 0%, #e3e3e3 100%)',
                  borderRadius: 4,
                  boxShadow: 6,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'scale(1.04)', boxShadow: 12 },
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#111', fontWeight: 'bold', mb: 1 }}>{stat.company}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PolicyIcon sx={{ color: '#1976d2', mr: 1 }} />
                      <Typography variant="body1" sx={{ color: '#111' }}>Policies: <b>{stat.numPolicies}</b></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MonetizationOnIcon sx={{ color: '#388e3c', mr: 1 }} />
                      <Typography variant="body1" sx={{ color: '#111' }}>Lifetime Commission: <b>₹{stat.totalCommission.toLocaleString('en-IN')}</b></Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BarChartIcon sx={{ color: '#fbc02d', mr: 1 }} />
                      <Typography variant="body1" sx={{ color: '#111' }}>Total Premium: <b>₹{stat.totalPremium.toLocaleString('en-IN')}</b></Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Bar Chart */}
          <Box sx={{ mb: 4, background: 'rgba(255,255,255,0.9)', borderRadius: 4, p: 3, boxShadow: 4 }}>
            <Bar data={barChartData} options={{...barChartOptions, plugins: { ...barChartOptions.plugins, title: { ...barChartOptions.plugins.title, color: '#111' } }, scales: { x: { ...barChartOptions.scales.x, ticks: { color: '#111', font: { weight: 'bold' } } }, y: { ...barChartOptions.scales.y, ticks: { color: '#111' } } } }} height={80} />
          </Box>
          <Divider sx={{ mb: 4, borderColor: '#333', borderWidth: 2 }} />
          {/* Company Cards */}
          <Typography variant="h6" sx={{ mb: 2, color: '#111', fontWeight: 'bold' }}>Select a Company</Typography>
          <Grid container spacing={3}>
            {companies.map((company) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={company}>
                <Card
                    sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 10 },
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 4,
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 3,
                    backdropFilter: 'blur(2px)',
                  }}
                  onClick={() => handleCompanyCardClick(company)}
                >
                  <CardContent>
                    <Typography variant="h5" align="center" sx={{ color: '#111', fontWeight: 'bold' }}>{company}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog open={companyDialogOpen} onClose={handleCloseCompanyDialog} maxWidth="lg" fullWidth
            PaperProps={{
              sx: {
                background: 'rgba(255,255,255,0.97)',
                boxShadow: 12,
                borderRadius: 4,
                backdropFilter: 'blur(6px)',
              }
            }}
          >
            <DialogTitle sx={{ color: '#111', fontWeight: 'bold' }}>{selectedCompany} - Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#111' }}>Policies for {selectedCompany}</Typography>
                  <TextField
                    fullWidth
                placeholder="Search by Policy Number or Insured Name"
                value={policySearch}
                onChange={e => { setPolicySearch(e.target.value); setPolicyPage(0); }}
                sx={{ mb: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 2, color: '#111' }}
                InputProps={{ style: { color: '#111' } }}
              />
              {filteredCompanyPolicies.length === 0 ? (
                <Typography sx={{ color: '#111' }}>No policies found for this company.</Typography>
              ) : (
                <>
                  <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3, borderRadius: 3, background: 'rgba(245,250,255,0.95)' }}>
                    <Table>
                      <TableHead sx={{ background: 'linear-gradient(90deg, #e3e3e3 0%, #fff 100%)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Policy Number</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Insured Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Policy Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Premium</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Total Premium</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Effective Commission (%)</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Total Commission</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>TP (%)</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>OD (%)</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#111' }}>Add-on (%)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedPolicies.map((policy) => (
                          <TableRow key={policy.id} sx={{ '&:hover': { background: '#e3e3e3' } }}>
                            <TableCell sx={{ color: '#111' }}>{policy.policyNumber}</TableCell>
                            <TableCell sx={{ color: '#111' }}>{policy.insuredName}</TableCell>
                            <TableCell sx={{ color: '#111' }}>{policy.type}</TableCell>
                            <TableCell sx={{ color: '#111' }}>₹{policy.premium || policy.totalPremium || '-'}</TableCell>
                            <TableCell sx={{ color: '#111' }}>₹{policy.totalPremium || policy.premium || '-'}</TableCell>
                            <TableCell sx={{ color: '#111' }}>{policy.effectiveCommissionPercentage || policy.effectiveCommission || '-'}</TableCell>
                            <TableCell sx={{ color: '#111' }}>₹{policy.totalCommissionAmount || policy.commissionAmount || '-'}</TableCell>
                            <TableCell sx={{ color: '#111' }}>{policy.tpCommissionPercentage || policy.tpCommission || '-'}</TableCell>
                            <TableCell sx={{ color: '#111' }}>{policy.odCommissionPercentage || policy.odCommission || '-'}</TableCell>
                            <TableCell sx={{ color: '#111' }}>{policy.addonCommissionPercentage || policy.addonCommission || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={filteredCompanyPolicies.length}
                    page={policyPage}
                    onPageChange={(e, newPage) => setPolicyPage(newPage)}
                    rowsPerPage={policyRowsPerPage}
                    onRowsPerPageChange={e => { setPolicyRowsPerPage(parseInt(e.target.value, 10)); setPolicyPage(0); }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{ color: '#111' }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCompanyDialog} sx={{ color: '#111' }}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default Commission;

