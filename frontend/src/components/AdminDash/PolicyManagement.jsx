import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  InputAdornment,
  Avatar,
  IconButton,
  Menu,
  Tab,
  Tabs,
  Select,
  FormControl,
  Modal,
  Grid,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Description as PolicyIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const PolicyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('All Policies');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('All');
  const [openNewPolicy, setOpenNewPolicy] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policyNumber: '',
    insuredName: '',
    clientName: '',
    endDate: '',
    company: '',
    business: 'New',
    status: 'Live Policy'
  });

  // List of insurance companies
  const insuranceCompanies = [
    'TATA AIG GIC',
    'ICICI Lombard GIC',
    'HDFC ERGO',
    'Bajaj Allianz',
    'SBI General Insurance'
  ];

  // Sample policy data - replace with actual data
  const policies = [
    {
      id: 'E202304T170000',
      insuredName: 'Lalit Kumar',
      clientName: 'Lalit Kumar',
      endDate: '10/09/2023',
      company: 'TATA AIG GIC',
      business: 'New',
      status: 'Live Policy'
    },
    {
      id: 'C202304T180000',
      insuredName: 'Suryakant Gupta',
      clientName: 'Suryakant Gupta',
      endDate: '10/09/2023',
      company: 'ICICI Lombard GIC',
      business: 'New',
      status: 'Live Policy'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuClick = (event, policy) => {
    setAnchorEl(event.currentTarget);
    setSelectedPolicy(policy);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPolicy(null);
  };

  const handleNewPolicyChange = (field) => (event) => {
    setNewPolicy({
      ...newPolicy,
      [field]: event.target.value
    });
  };

  const handleAddPolicy = () => {
    // Add validation here
    const newPolicyWithId = {
      ...newPolicy,
      id: `P${Date.now()}`,
    };
    // Here you would typically make an API call to save the policy
    console.log('New Policy:', newPolicyWithId);
    setOpenNewPolicy(false);
    setNewPolicy({
      policyNumber: '',
      insuredName: '',
      clientName: '',
      endDate: '',
      company: '',
      business: 'New',
      status: 'Live Policy'
    });
  };

  const filteredPolicies = policies.filter(policy =>
    Object.values(policy).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "primary.main" }}>
        Policy Management
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, backgroundColor: "primary.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Total Policies</Typography>
            <Typography variant="h4">{policies.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6">Live Policies</Typography>
            <Typography variant="h4" color="success.main">
              {policies.filter(p => p.status === 'Live Policy').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6">Quotations</Typography>
            <Typography variant="h4" color="warning.main">
              {policies.filter(p => p.status === 'Quotation').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6">Lapsed</Typography>
            <Typography variant="h4" color="error.main">
              {policies.filter(p => p.status === 'Lapsed').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#666',
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 100,
              '&.Mui-selected': {
                color: 'primary.main'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab label="All Policies" value="All Policies" />
          <Tab label="Quotations" value="Quotations" />
          <Tab label="Lapsed" value="Lapsed" />
        </Tabs>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Current Month Filter */}
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            displayEmpty
            sx={{
              height: '40px',
              backgroundColor: 'white',
              '& .MuiSelect-select': {
                paddingTop: '8px',
                paddingBottom: '8px',
              }
            }}
          >
            <MenuItem value="All">Current Month: All</MenuItem>
            <MenuItem value="January">January</MenuItem>
            <MenuItem value="February">February</MenuItem>
            <MenuItem value="March">March</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search Policy..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              height: '40px',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Add New Policy Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewPolicy(true)}
          sx={{
            height: '40px',
            textTransform: 'none',
          }}
        >
          New Policy
        </Button>
      </Box>

      {/* Policies Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Policy Number</TableCell>
              <TableCell>Insured Name</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PolicyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography>{policy.id}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                      {policy.insuredName.charAt(0)}
                    </Avatar>
                    <Typography>{policy.insuredName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{policy.clientName}</TableCell>
                <TableCell>{policy.endDate}</TableCell>
                <TableCell>{policy.company}</TableCell>
                <TableCell>
                  <Chip 
                    label={policy.business} 
                    size="small"
                    color={policy.business === 'New' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={policy.status} 
                    size="small"
                    color={
                      policy.status === 'Live Policy' ? 'success' :
                      policy.status === 'Quotation' ? 'warning' :
                      'error'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, policy)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedPolicy?.id === policy.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <ViewIcon sx={{ mr: 1 }} /> View Details
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <EditIcon sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Policy Modal */}
      <Modal
        open={openNewPolicy}
        onClose={() => setOpenNewPolicy(false)}
        aria-labelledby="new-policy-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Add New Policy
            </Typography>
            <IconButton onClick={() => setOpenNewPolicy(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Policy Number"
                value={newPolicy.policyNumber}
                onChange={handleNewPolicyChange('policyNumber')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Insured Name"
                value={newPolicy.insuredName}
                onChange={handleNewPolicyChange('insuredName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={newPolicy.clientName}
                onChange={handleNewPolicyChange('clientName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={newPolicy.endDate}
                onChange={handleNewPolicyChange('endDate')}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Company"
                value={newPolicy.company}
                onChange={handleNewPolicyChange('company')}
                required
              >
                {insuranceCompanies.map((company) => (
                  <MenuItem key={company} value={company}>
                    {company}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Business"
                value={newPolicy.business}
                onChange={handleNewPolicyChange('business')}
                required
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Renewal">Renewal</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenNewPolicy(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddPolicy}>
              Add Policy
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PolicyManagement; 