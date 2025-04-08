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
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Description as PolicyIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as VehicleIcon,
  LocalHospital as HealthIcon,
  Flight as TravelIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const PolicyStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('All');
  const [openNewPolicy, setOpenNewPolicy] = useState(false);
  const [insuranceType, setInsuranceType] = useState('vehicle');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Insurance companies
  const insuranceCompanies = [
    'TATA AIG GIC',
    'ICICI Lombard GIC',
    'HDFC ERGO',
    'Bajaj Allianz',
    'SBI General Insurance',
    'New India Assurance',
    'United India Insurance',
    'National Insurance',
    'Oriental Insurance'
  ];

  // Vehicle types
  const vehicleTypes = [
    'Private Car',
    'Two-Wheeler',
    'Commercial Vehicle',
    'Taxi',
    'Bus',
    'Truck'
  ];

  // Health insurance plans
  const healthPlans = [
    'Individual',
    'Family Floater',
    'Senior Citizen',
    'Critical Illness',
    'Group Health'
  ];

  // Travel insurance types
  const travelTypes = [
    'Individual',
    'Family',
    'Student',
    'Business',
    'Senior Citizen'
  ];

  // Remove dummy data
  const [policies, setPolicies] = useState([]);

  // New policy form state
  const [newPolicy, setNewPolicy] = useState({
    policyNumber: '',
    insuredName: '',
    clientName: '',
    mobile: '',
    email: '',
    startDate: '',
    endDate: '',
    company: '',
    business: 'New',
    type: 'vehicle',
    // Vehicle specific
    vehicleType: '',
    vehicleNumber: '',
    make: '',
    model: '',
    year: '',
    // Health specific
    healthPlan: '',
    sumInsured: '',
    age: '',
    preExisting: 'No',
    // Travel specific
    travelType: '',
    destination: '',
    tripDuration: '',
    // Common
    premium: '',
    nominee: '',
    documents: []
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuClick = (event, policy) => {
    setAnchorEl(event.currentTarget);
    setSelectedPolicy(policy);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewPolicyChange = (field) => (event) => {
    setNewPolicy({
      ...newPolicy,
      [field]: event.target.value
    });
  };

  const handleAddPolicy = () => {
    // Validate required fields
    if (!newPolicy.policyNumber || !newPolicy.insuredName || !newPolicy.clientName || 
        !newPolicy.endDate || !newPolicy.company || !newPolicy.business) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Create new policy object with all the fields
    const policyToAdd = {
      id: `P${Date.now()}`, // Generate unique ID
      policyNumber: newPolicy.policyNumber,
      insuredName: newPolicy.insuredName,
      clientName: newPolicy.clientName,
      mobile: newPolicy.mobile || '',
      email: newPolicy.email || '',
      startDate: newPolicy.startDate || '',
      endDate: newPolicy.endDate,
      company: newPolicy.company,
      business: newPolicy.business,
      type: insuranceType, // Add the insurance type
      status: 'Live Policy',
      premium: newPolicy.premium || '',
      nominee: newPolicy.nominee || '',
      documents: uploadedFiles.map(file => file.name),

      // Vehicle specific fields
      vehicleType: insuranceType === 'vehicle' ? newPolicy.vehicleType : '',
      vehicleNumber: insuranceType === 'vehicle' ? newPolicy.vehicleNumber : '',
      make: insuranceType === 'vehicle' ? newPolicy.make : '',
      model: insuranceType === 'vehicle' ? newPolicy.model : '',
      year: insuranceType === 'vehicle' ? newPolicy.year : '',

      // Health specific fields
      healthPlan: insuranceType === 'health' ? newPolicy.healthPlan : '',
      sumInsured: insuranceType === 'health' ? newPolicy.sumInsured : '',
      age: insuranceType === 'health' ? newPolicy.age : '',
      preExisting: insuranceType === 'health' ? newPolicy.preExisting : '',

      // Travel specific fields
      travelType: insuranceType === 'travel' ? newPolicy.travelType : '',
      destination: insuranceType === 'travel' ? newPolicy.destination : '',
      tripDuration: insuranceType === 'travel' ? newPolicy.tripDuration : ''
    };

    // Add new policy to the list
    setPolicies(prevPolicies => [...prevPolicies, policyToAdd]);

    // Show success message
    setSnackbar({
      open: true,
      message: 'Policy created successfully',
      severity: 'success'
    });

    // Close modal and reset form
    setOpenNewPolicy(false);
    setNewPolicy({
      policyNumber: '',
      insuredName: '',
      clientName: '',
      mobile: '',
      email: '',
      startDate: '',
      endDate: '',
      company: '',
      business: 'New',
      type: 'vehicle',
      vehicleType: '',
      vehicleNumber: '',
      make: '',
      model: '',
      year: '',
      healthPlan: '',
      sumInsured: '',
      age: '',
      preExisting: 'No',
      travelType: '',
      destination: '',
      tripDuration: '',
      premium: '',
      nominee: '',
      documents: []
    });
    setUploadedFiles([]);
    setInsuranceType('vehicle');
  };

  const resetForm = () => {
    setNewPolicy({
      policyNumber: '',
      insuredName: '',
      clientName: '',
      mobile: '',
      email: '',
      startDate: '',
      endDate: '',
      company: '',
      business: 'New',
      type: 'vehicle',
      vehicleType: '',
      vehicleNumber: '',
      make: '',
      model: '',
      year: '',
      healthPlan: '',
      sumInsured: '',
      age: '',
      preExisting: 'No',
      travelType: '',
      destination: '',
      tripDuration: '',
      premium: '',
      nominee: '',
      documents: []
    });
    setUploadedFiles([]);
  };

  const filteredPolicies = policies.filter(policy => {
    // Filter by tab
    if (currentTab !== 'all' && policy.status !== currentTab) {
      return false;
    }
    
    // Filter by search term
    return Object.values(policy).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'lapsed': return 'error';
      case 'pending': return 'warning';
      default: return 'primary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vehicle': return <VehicleIcon fontSize="small" />;
      case 'health': return <HealthIcon fontSize="small" />;
      case 'travel': return <TravelIcon fontSize="small" />;
      default: return <PolicyIcon fontSize="small" />;
    }
  };

  // Handle View Details
  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setViewModalOpen(true);
    handleMenuClose();
  };

  // Handle Edit
  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setNewPolicy(policy); // Set form data with selected policy
    setEditModalOpen(true);
    handleMenuClose();
  };

  // Handle Delete
  const handleDelete = (policy) => {
    setSelectedPolicy(policy);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedPolicy) return;
    
    setPolicies(prevPolicies => prevPolicies.filter(p => p.id !== selectedPolicy.id));
    setDeleteDialogOpen(false);
    setSelectedPolicy(null); // Clear selected policy after deletion
    setSnackbar({
      open: true,
      message: 'Policy deleted successfully',
      severity: 'success'
    });
  };

  // Handle Update Policy
  const handleUpdatePolicy = () => {
    if (!newPolicy.policyNumber || !newPolicy.insuredName || !newPolicy.clientName || 
        !newPolicy.endDate || !newPolicy.company || !newPolicy.business) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    setPolicies(prevPolicies => 
      prevPolicies.map(policy => 
        policy.id === selectedPolicy.id ? { ...newPolicy, id: policy.id } : policy
      )
    );

    setSnackbar({
      open: true,
      message: 'Policy updated successfully',
      severity: 'success'
    });

    setEditModalOpen(false);
    setNewPolicy({
      policyNumber: '',
      insuredName: '',
      clientName: '',
      endDate: '',
      company: '',
      business: 'New',
      type: 'vehicle',
      vehicleType: '',
      vehicleNumber: '',
      make: '',
      model: '',
      year: '',
      healthPlan: '',
      sumInsured: '',
      age: '',
      preExisting: 'No',
      travelType: '',
      destination: '',
      tripDuration: '',
      premium: '',
      nominee: '',
      documents: []
    });
  };

  // Add cleanup for modal closes
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPolicy(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: "#333" }}>
        Policy Management
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
          <Tab label="All Policies" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Lapsed" value="lapsed" />
          <Tab label="Pending" value="pending" />
        </Tabs>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
          {/* All Time Period Filter */}
          <FormControl sx={{ minWidth: 180 }}>
            <Select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              displayEmpty
              sx={{
                height: '40px',
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  color: 'black'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '& .MuiSelect-icon': {
                  color: 'primary.main'
                }
              }}
            >
              <MenuItem value="All">All Time Period</MenuItem>
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
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                height: '40px',
                color: 'black',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
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
        </Box>

        {/* Add New Policy Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewPolicy(true)}
          sx={{
            height: '40px',
            textTransform: 'none',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
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
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Policy Number</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Insured Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Business</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
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
                    <MenuItem onClick={() => handleViewDetails(policy)}>
                      <ViewIcon sx={{ mr: 1 }} /> View Details
                    </MenuItem>
                    <MenuItem onClick={() => handleEdit(policy)}>
                      <EditIcon sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(policy)} sx={{ color: 'error.main' }}>
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
          width: { xs: '90%', md: '800px' },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          overflow: 'auto',
        }}>
          <Box sx={{ 
            position: 'sticky', 
            top: 0, 
            bgcolor: 'background.paper', 
            zIndex: 1,
            p: 3,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" component="h2">
              Create New Insurance Policy
            </Typography>
            <IconButton onClick={() => {
              setOpenNewPolicy(false);
              resetForm();
            }} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Insurance Type Selection */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Insurance Type</FormLabel>
              <RadioGroup
                row
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value)}
                sx={{ gap: 2, mt: 1 }}
              >
                <Card variant="outlined" sx={{ width: 120 }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <FormControlLabel
                      value="vehicle"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <VehicleIcon sx={{ mb: 1 }} />
                          <Typography variant="body2">Vehicle</Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </CardContent>
                </Card>
                <Card variant="outlined" sx={{ width: 120 }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <FormControlLabel
                      value="health"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <HealthIcon sx={{ mb: 1 }} />
                          <Typography variant="body2">Health</Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </CardContent>
                </Card>
                <Card variant="outlined" sx={{ width: 120 }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <FormControlLabel
                      value="travel"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <TravelIcon sx={{ mb: 1 }} />
                          <Typography variant="body2">Travel</Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </CardContent>
                </Card>
              </RadioGroup>
            </FormControl>

            <Grid container spacing={3}>
              {/* Common Fields */}
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
                <FormControl fullWidth>
                  <Select
                    value={newPolicy.company}
                    onChange={handleNewPolicyChange('company')}
                    displayEmpty
                    required
                    renderValue={(selected) => selected || "Select Insurance Company"}
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
                  label="Mobile Number"
                  value={newPolicy.mobile}
                  onChange={handleNewPolicyChange('mobile')}
                  type="tel"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={newPolicy.email}
                  onChange={handleNewPolicyChange('email')}
                  type="email"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mb: 1, 
                      color: 'text.secondary',
                      position: 'relative',
                      fontSize: '0.75rem'
                    }}
                  >
                    Start Date *
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={newPolicy.startDate}
                    onChange={handleNewPolicyChange('startDate')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          borderRadius: 1
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                        fontSize: '0.875rem',
                        padding: '10px 14px',
                        cursor: 'pointer'
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        cursor: 'pointer',
                        filter: 'invert(0.5)'
                      }
                    }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mb: 1, 
                      color: 'text.secondary',
                      position: 'relative',
                      fontSize: '0.75rem'
                    }}
                  >
                    End Date *
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={newPolicy.endDate}
                    onChange={handleNewPolicyChange('endDate')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          borderRadius: 1
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                        fontSize: '0.875rem',
                        padding: '10px 14px',
                        cursor: 'pointer'
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        cursor: 'pointer',
                        filter: 'invert(0.5)'
                      }
                    }}
                    inputProps={{
                      min: newPolicy.startDate || new Date().toISOString().split('T')[0]
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Select
                    value={newPolicy.business}
                    onChange={handleNewPolicyChange('business')}
                  >
                    <MenuItem value="New">New Business</MenuItem>
                    <MenuItem value="Renewal">Renewal</MenuItem>
                    <MenuItem value="Portability">Portability</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Premium Amount"
                  value={newPolicy.premium}
                  onChange={handleNewPolicyChange('premium')}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nominee Name"
                  value={newPolicy.nominee}
                  onChange={handleNewPolicyChange('nominee')}
                />
              </Grid>

              {/* Type-Specific Fields */}
              {insuranceType === 'vehicle' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                      Vehicle Details
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={newPolicy.vehicleType}
                        onChange={handleNewPolicyChange('vehicleType')}
                        displayEmpty
                        renderValue={(selected) => selected || "Select Vehicle Type"}
                      >
                        {vehicleTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Registration Number"
                      value={newPolicy.vehicleNumber}
                      onChange={handleNewPolicyChange('vehicleNumber')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Make"
                      value={newPolicy.make}
                      onChange={handleNewPolicyChange('make')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Model"
                      value={newPolicy.model}
                      onChange={handleNewPolicyChange('model')}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Manufacturing Year"
                      value={newPolicy.year}
                      onChange={handleNewPolicyChange('year')}
                      type="number"
                    />
                  </Grid>
                </>
              )}

              {insuranceType === 'health' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                      Health Details
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={newPolicy.healthPlan}
                        onChange={handleNewPolicyChange('healthPlan')}
                        displayEmpty
                        renderValue={(selected) => selected || "Select Health Plan"}
                      >
                        {healthPlans.map((plan) => (
                          <MenuItem key={plan} value={plan}>
                            {plan}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Sum Insured"
                      value={newPolicy.sumInsured}
                      onChange={handleNewPolicyChange('sumInsured')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      value={newPolicy.age}
                      onChange={handleNewPolicyChange('age')}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={newPolicy.preExisting}
                        onChange={handleNewPolicyChange('preExisting')}
                      >
                        <MenuItem value="No">No Pre-existing Conditions</MenuItem>
                        <MenuItem value="Yes">Pre-existing Conditions</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {insuranceType === 'travel' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                      Travel Details
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={newPolicy.travelType}
                        onChange={handleNewPolicyChange('travelType')}
                        displayEmpty
                        renderValue={(selected) => selected || "Select Travel Type"}
                      >
                        {travelTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Destination"
                      value={newPolicy.destination}
                      onChange={handleNewPolicyChange('destination')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Trip Duration (Days)"
                      value={newPolicy.tripDuration}
                      onChange={handleNewPolicyChange('tripDuration')}
                      type="number"
                    />
                  </Grid>
                </>
              )}

              {/* Document Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                  Upload Documents
                </Typography>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload Documents
                    <VisuallyHiddenInput 
                      type="file" 
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Accepted formats: PDF, DOC, JPG, PNG (Max 10MB each)
                  </Typography>
                  
                  {uploadedFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Selected Files:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {uploadedFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => removeFile(index)}
                            variant="outlined"
                            size="small"
                            sx={{ maxWidth: 200 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={() => {
                  setOpenNewPolicy(false);
                  resetForm();
                }}
                sx={{ textTransform: 'none' }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddPolicy}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "#0C47A0",
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: "#1565C0"
                  }
                }}
              >
                {isSubmitting ? 'Creating Policy...' : 'Create Policy'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        aria-labelledby="view-policy-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Policy Details</Typography>
            <IconButton onClick={() => setViewModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedPolicy && (
            <>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Policy Number</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.policyNumber}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Insured Name</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.insuredName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Client Name</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.clientName}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.mobile || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.email || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Nominee</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.nominee || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Policy Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                    Policy Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Insurance Company</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.company}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.startDate || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.endDate}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Business Type</Typography>
                        <Chip 
                          label={selectedPolicy.business} 
                          size="small"
                          color={selectedPolicy.business === 'New' ? 'primary' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Premium Amount</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {selectedPolicy.premium ? `₹${selectedPolicy.premium}` : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Chip 
                          label={selectedPolicy.status} 
                          size="small"
                          color={
                            selectedPolicy.status === 'Live Policy' ? 'success' :
                            selectedPolicy.status === 'Quotation' ? 'warning' :
                            'error'
                          }
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Type Specific Details */}
                {selectedPolicy.type === 'vehicle' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Vehicle Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Vehicle Type</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.vehicleType || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Vehicle Number</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.vehicleNumber || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Make & Model</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {selectedPolicy.make && selectedPolicy.model ? 
                              `${selectedPolicy.make} ${selectedPolicy.model}` : 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Manufacturing Year</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.year || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {selectedPolicy.type === 'health' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Health Insurance Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Health Plan</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.healthPlan || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Sum Insured</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {selectedPolicy.sumInsured ? `₹${selectedPolicy.sumInsured}` : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.age || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Pre-existing Conditions</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.preExisting || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {selectedPolicy.type === 'travel' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Travel Insurance Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Travel Type</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.travelType || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Destination</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.destination || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Trip Duration</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {selectedPolicy.tripDuration ? `${selectedPolicy.tripDuration} Days` : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Documents Section */}
                {selectedPolicy.documents && selectedPolicy.documents.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Documents
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedPolicy.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          variant="outlined"
                          size="small"
                          icon={<DownloadIcon />}
                          onClick={() => {/* Handle document download */}}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-policy-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Edit Policy</Typography>
            <IconButton onClick={() => setEditModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {/* Reuse the same form fields as in the Add New Policy modal */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={newPolicy.policyNumber}
                onChange={(e) => setNewPolicy({ ...newPolicy, policyNumber: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Insured Name"
                value={newPolicy.insuredName}
                onChange={(e) => setNewPolicy({ ...newPolicy, insuredName: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Client Name"
                value={newPolicy.clientName}
                onChange={(e) => setNewPolicy({ ...newPolicy, clientName: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={newPolicy.endDate}
                onChange={(e) => setNewPolicy({ ...newPolicy, endDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Company</InputLabel>
                <Select
                  value={newPolicy.company}
                  onChange={(e) => setNewPolicy({ ...newPolicy, company: e.target.value })}
                  label="Company"
                  required
                >
                  {insuranceCompanies.map((company) => (
                    <MenuItem key={company} value={company}>{company}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Business</InputLabel>
                <Select
                  value={newPolicy.business}
                  onChange={(e) => setNewPolicy({ ...newPolicy, business: e.target.value })}
                  label="Business"
                  required
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Renewal">Renewal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdatePolicy}>Update Policy</Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Policy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this policy? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PolicyStatus;