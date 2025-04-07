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
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Description as PolicyIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const PolicyStatus = () => {
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
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: "#666" }}>
        Policy Status
      </Typography>

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
                color: '#0C47A0'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0C47A0'
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
            backgroundColor: "#0C47A0",
            textTransform: 'none',
            '&:hover': {
              backgroundColor: "#1565C0"
            }
          }}
        >
          New Policy
        </Button>
      </Box>

      {/* Policies Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
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
                    <PolicyIcon sx={{ color: '#0C47A0', fontSize: 20 }} />
                    <Typography>{policy.id}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#0C47A0', fontSize: '0.875rem' }}>
                      {policy.insuredName.charAt(0)}
                    </Avatar>
                    <Typography>{policy.insuredName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{policy.clientName}</TableCell>
                <TableCell>{policy.endDate}</TableCell>
                <TableCell>{policy.company}</TableCell>
                <TableCell>
                  <Typography sx={{ color: '#0C47A0' }}>
                    {policy.business}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#FFA726',
                      '&:hover': {
                        backgroundColor: '#FB8C00'
                      },
                      textTransform: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    {policy.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, policy)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download Policy</MenuItem>
      </Menu>

      {/* New Policy Modal */}
      <Modal
        open={openNewPolicy}
        onClose={() => setOpenNewPolicy(false)}
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
          borderRadius: 1,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Add New Policy
            </Typography>
            <IconButton onClick={() => setOpenNewPolicy(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={newPolicy.policyNumber}
                onChange={handleNewPolicyChange('policyNumber')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Insured Name"
                value={newPolicy.insuredName}
                onChange={handleNewPolicyChange('insuredName')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={newPolicy.clientName}
                onChange={handleNewPolicyChange('clientName')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={newPolicy.endDate}
                onChange={handleNewPolicyChange('endDate')}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Select
                  value={newPolicy.company}
                  onChange={handleNewPolicyChange('company')}
                  displayEmpty
                  renderValue={(selected) => selected || "Select Company"}
                >
                  {insuranceCompanies.map((company) => (
                    <MenuItem key={company} value={company}>
                      {company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Select
                  value={newPolicy.business}
                  onChange={handleNewPolicyChange('business')}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Renewal">Renewal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              onClick={() => setOpenNewPolicy(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddPolicy}
              sx={{
                backgroundColor: "#0C47A0",
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: "#1565C0"
                }
              }}
            >
              Add Policy
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PolicyStatus; 