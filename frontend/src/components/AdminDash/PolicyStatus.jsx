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
  LinearProgress
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

  // Sample policy data
  const policies = [
    {
      id: 'E202304T170000',
      insuredName: 'Lalit Kumar',
      clientName: 'Lalit Kumar',
      endDate: '10/09/2023',
      company: 'TATA AIG GIC',
      business: 'New',
      status: 'active',
      type: 'vehicle',
      premium: '₹8,750',
      startDate: '10/09/2022',
      vehicleNumber: 'DL5CAB1234'
    },
    {
      id: 'C202304T180000',
      insuredName: 'Suryakant Gupta',
      clientName: 'Suryakant Gupta',
      endDate: '15/11/2023',
      company: 'ICICI Lombard GIC',
      business: 'Renewal',
      status: 'active',
      type: 'health',
      premium: '₹12,500',
      startDate: '15/11/2022',
      sumInsured: '₹5,00,000'
    },
    {
      id: 'T202305T190000',
      insuredName: 'Priya Sharma',
      clientName: 'Priya Sharma',
      endDate: '20/12/2023',
      company: 'HDFC ERGO',
      business: 'New',
      status: 'lapsed',
      type: 'travel',
      premium: '₹2,300',
      startDate: '20/12/2022',
      destination: 'USA'
    }
  ];

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
    setSelectedPolicy(null);
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
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newPolicyWithId = {
        ...newPolicy,
        id: `P${Date.now()}`,
        status: 'active',
        documents: uploadedFiles.map(file => file.name)
      };
      
      console.log('New Policy:', newPolicyWithId);
      setIsSubmitting(false);
      setOpenNewPolicy(false);
      resetForm();
    }, 2000);
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
            <MenuItem value="All">All Time Periods</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="This Quarter">This Quarter</MenuItem>
            <MenuItem value="This Year">This Year</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search policies..."
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
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Policy Details</TableCell>
              <TableCell>Client Information</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell>Insurance Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy) => (
                <TableRow key={policy.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {getTypeIcon(policy.type)}
                      <Box>
                        <Typography fontWeight="500">{policy.id}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {policy.company}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#0C47A0' }}>
                        {policy.insuredName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="500">{policy.insuredName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {policy.clientName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">Start: {policy.startDate}</Typography>
                      <Typography variant="body2">End: {policy.endDate}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {policy.type === 'vehicle' && `Vehicle: ${policy.vehicleNumber}`}
                        {policy.type === 'health' && `Sum Insured: ${policy.sumInsured}`}
                        {policy.type === 'travel' && `Destination: ${policy.destination}`}
                      </Typography>
                      <Typography variant="body2">Premium: {policy.premium}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={policy.status === 'active' ? 'Active' : policy.status === 'lapsed' ? 'Lapsed' : 'Pending'}
                      color={getStatusColor(policy.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, policy)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No policies found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ViewIcon sx={{ mr: 1, fontSize: 20 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1, fontSize: 20 }} /> Download Policy
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} /> Edit Policy
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} /> Delete Policy
        </MenuItem>
      </Menu>

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
            <Divider/>
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
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newPolicy.startDate}
                  onChange={handleNewPolicyChange('startDate')}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
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
    </Box>
  );
};

export default PolicyStatus;