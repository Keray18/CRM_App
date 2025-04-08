import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Switch,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel
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
  Flight as TravelIcon,
  PictureAsPdf as PdfIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Category as CategoryIcon,
  MonetizationOn as PremiumIcon,
  Stars as StarIcon,
  Policy as PolicyManagementIcon,
  Star as FeaturedIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

// AWS SDK (commented out but ready for future implementation)
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

// Color scheme
const colors = {
  primary: '#3f51b5',
  secondary: '#9c27b0',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  background: '#f5f7fa',
  cardBackground: '#ffffff',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#e0e0e0',
  highlight: '#ffeb3b'
};

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [categories, setCategories] = useState([
    'Vehicle',
    'Health',
    'Travel',
    'Life',
    'Property',
    'Business'
  ]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([
    'TATA AIG GIC',
    'ICICI Lombard GIC',
    'HDFC ERGO',
    'Bajaj Allianz',
    'SBI General Insurance'
  ]);

  // New policy form state
  const [newPolicy, setNewPolicy] = useState({
    id: '',
    name: '',
    description: '',
    category: 'Vehicle',
    company: '',
    premiumOptions: [],
    coverageDetails: [],
    features: [],
    requirements: [],
    isFeatured: false,
    isActive: true,
    documents: [],
    createdAt: '',
    updatedAt: ''
  });

  // Initialize with sample data
  useEffect(() => {
    const samplePolicies = [
      {
        id: uuidv4(),
        name: 'Comprehensive Car Insurance',
        description: 'Complete coverage for your vehicle including third-party liability and own damage',
        category: 'Vehicle',
        company: 'TATA AIG GIC',
        premiumOptions: [
          { type: 'Annual', amount: '₹12,500', discount: '10%' },
          { type: 'Semi-Annual', amount: '₹6,500', discount: '5%' }
        ],
        coverageDetails: [
          'Own Damage Cover',
          'Third Party Liability',
          'Personal Accident Cover',
          'Zero Depreciation'
        ],
        features: [
          '24/7 Roadside Assistance',
          'Cashless Claim Settlement',
          'Quick Claim Processing'
        ],
        requirements: [
          'Vehicle RC Copy',
          'Previous Policy Details',
          'Owner ID Proof'
        ],
        isFeatured: true,
        isActive: true,
        documents: ['policy-doc.pdf', 'terms.pdf'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Family Health Shield',
        description: 'Comprehensive health insurance for your entire family with cashless hospitalization',
        category: 'Health',
        company: 'HDFC ERGO',
        premiumOptions: [
          { type: 'Annual', amount: '₹25,000', discount: '15%' }
        ],
        coverageDetails: [
          'Hospitalization Expenses',
          'Pre and Post Hospitalization',
          'Day Care Procedures',
          'Ambulance Charges'
        ],
        features: [
          'Cashless Network Hospitals',
          'No Claim Bonus',
          'Free Health Checkup'
        ],
        requirements: [
          'Age Proof',
          'Medical History',
          'Address Proof'
        ],
        isFeatured: false,
        isActive: true,
        documents: ['health-policy.pdf'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setPolicies(samplePolicies);
    setFilteredPolicies(samplePolicies);
  }, []);

  // Filter policies based on search and tab
  useEffect(() => {
    let result = policies;
    
    // Filter by tab
    if (currentTab === 'featured') {
      result = result.filter(policy => policy.isFeatured);
    } else if (currentTab === 'active') {
      result = result.filter(policy => policy.isActive);
    } else if (currentTab === 'inactive') {
      result = result.filter(policy => !policy.isActive);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(policy =>
        Object.values(policy).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
    
    
    setFilteredPolicies(result);
  }, [searchTerm, currentTab, policies]);

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

  const handleAddPolicy = () => {
    setIsEditing(false);
    setNewPolicy({
      id: uuidv4(),
      name: '',
      description: '',
      category: 'Vehicle',
      company: '',
      premiumOptions: [{ type: '', amount: '', discount: '' }],
      coverageDetails: [''],
      features: [''],
      requirements: [''],
      isFeatured: false,
      isActive: true,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setActiveStep(0);
    setOpenPolicyModal(true);
  };

  const handleEditPolicy = (policy) => {
    setIsEditing(true);
    setNewPolicy(policy);
    setActiveStep(0);
    setOpenPolicyModal(true);
  };

  const handlePolicyChange = (field, value) => {
    setNewPolicy(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    const updatedArray = [...newPolicy[field]];
    updatedArray[index] = value;
    handlePolicyChange(field, updatedArray);
  };

  const addArrayFieldItem = (field) => {
    handlePolicyChange(field, [...newPolicy[field], '']);
  };

  const removeArrayFieldItem = (field, index) => {
    const updatedArray = newPolicy[field].filter((_, i) => i !== index);
    handlePolicyChange(field, updatedArray);
  };

  const handlePremiumOptionChange = (index, field, value) => {
    const updatedOptions = [...newPolicy.premiumOptions];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    handlePolicyChange('premiumOptions', updatedOptions);
  };

  const addPremiumOption = () => {
    handlePolicyChange('premiumOptions', [
      ...newPolicy.premiumOptions,
      { type: '', amount: '', discount: '' }
    ]);
  };

  const removePremiumOption = (index) => {
    const updatedOptions = newPolicy.premiumOptions.filter((_, i) => i !== index);
    handlePolicyChange('premiumOptions', updatedOptions);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmitPolicy = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const finalPolicy = {
        ...newPolicy,
        documents: [...newPolicy.documents, ...uploadedFiles.map(file => file.name)]
      };
      
      if (isEditing) {
        // Update existing policy
        setPolicies(prev => 
          prev.map(policy => policy.id === finalPolicy.id ? finalPolicy : policy)
        );
      } else {
        // Add new policy
        setPolicies(prev => [...prev, finalPolicy]);
      }
      
      setIsSubmitting(false);
      setOpenPolicyModal(false);
      setUploadedFiles([]);
    }, 1500);
  };

  const handleDeletePolicy = () => {
    setPolicies(prev => prev.filter(policy => policy.id !== selectedPolicy.id));
    handleMenuClose();
  };

  const togglePolicyStatus = (policyId) => {
    setPolicies(prev =>
      prev.map(policy =>
        policy.id === policyId
          ? { ...policy, isActive: !policy.isActive }
          : policy
      )
    );
  };

  const toggleFeaturedStatus = (policyId) => {
    setPolicies(prev =>
      prev.map(policy =>
        policy.id === policyId
          ? { ...policy, isFeatured: !policy.isFeatured }
          : policy
      )
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Vehicle': return <VehicleIcon fontSize="small" />;
      case 'Health': return <HealthIcon fontSize="small" />;
      case 'Travel': return <TravelIcon fontSize="small" />;
      case 'Life': return <PolicyIcon fontSize="small" />;
      default: return <CategoryIcon fontSize="small" />;
    }
  };

  const steps = ['Basic Information', 'Coverage Details', 'Premium Options', 'Documents'];

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PolicyManagementIcon sx={{ fontSize: 40, color: colors.primary, mr: 2 }} />
        <Typography variant="h4" fontWeight="bold" sx={{ color: colors.textPrimary }}>
          Policy Management
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: colors.border, 
        mb: 3,
        backgroundColor: colors.cardBackground,
        borderRadius: 1,
        boxShadow: 1,
        p: 1
      }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: colors.textSecondary,
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 100,
              '&.Mui-selected': {
                color: colors.primary,
                fontWeight: 'bold'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary,
              height: 3
            }
          }}
        >
          <Tab label="All Policies" value="all" />
          <Tab label="Featured" value="featured" />
          <Tab label="Active" value="active" />
          <Tab label="Inactive" value="inactive" />
        </Tabs>
      </Box>

      {/* Search and Add Policy Section */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        p: 2,
        borderRadius: 1,
        boxShadow: 1
      }}>
        <TextField
          placeholder="Search policies..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 1,
              color: colors.textPrimary,
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.textSecondary }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPolicy}
          sx={{
            height: '60px',
            width: '200px',
            backgroundColor: colors.primary,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#303f9f'
            }
          }}
        >
          New Policy
        </Button>
      </Box>

      {/* Policies Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 2, 
          border: `1px solid ${colors.border}`,
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 300px)'
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: colors.primary }}>
            <TableRow>
              {['Policy Name', 'Category', 'Insurance Company', 'Premium Options', 'Status', 'Actions'].map((header) => (
                <TableCell 
                  key={header}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy) => (
                <TableRow 
                  key={policy.id} 
                  // sx={{ 
                  //   '&:nth-of-type(even)': {
                  //     backgroundColor: colors.background
                  //   }
                  // }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {policy.isFeatured && (
                        <FeaturedIcon sx={{ color: colors.highlight }} />
                      )}
                      <Box>
                        <Typography fontWeight="600">{policy.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {policy.description.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(policy.category)}
                      <Typography>{policy.category}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{policy.company}</Typography>
                  </TableCell>
                  <TableCell>
                    {policy.premiumOptions.map((option, index) => (
                      <Box key={index} sx={{ mb: 0.5 }}>
                        <Typography variant="body2">
                          <strong>{option.type}:</strong> {option.amount} {option.discount && `(${option.discount} off)`}
                        </Typography>
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={policy.isActive}
                        onChange={() => togglePolicyStatus(policy.id)}
                        color="success"
                        size="small"
                      />
                      <Chip
                        label={policy.isActive ? 'Active' : 'Inactive'}
                        color={policy.isActive ? 'success' : 'error'}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: 80,
                          justifyContent: 'center'
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={policy.isFeatured ? 'Remove from featured' : 'Mark as featured'}>
                        <IconButton 
                          size="small"
                          onClick={() => toggleFeaturedStatus(policy.id)}
                          sx={{
                            color: policy.isFeatured ? colors.highlight : colors.textSecondary,
                            '&:hover': {
                              backgroundColor: colors.highlight + '20'
                            }
                          }}
                        >
                          <StarIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuClick(e, policy)}
                        sx={{
                          '&:hover': {
                            backgroundColor: colors.primary + '20'
                          }
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? 'No matching policies found' : 'No policies available'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />}
                    onClick={handleAddPolicy}
                    sx={{ mt: 2 }}
                  >
                    Create New Policy
                  </Button>
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
        PaperProps={{
          sx: {
            boxShadow: 2,
            minWidth: 180
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleEditPolicy(selectedPolicy);
            handleMenuClose();
          }}
          sx={{ color: colors.textPrimary }}
        >
          <EditIcon sx={{ mr: 1.5, fontSize: 20, color: colors.primary }} /> Edit Policy
        </MenuItem>
        <MenuItem 
          onClick={() => {
            toggleFeaturedStatus(selectedPolicy.id);
            handleMenuClose();
          }}
          sx={{ color: colors.textPrimary }}
        >
          {selectedPolicy?.isFeatured ? (
            <>
              <FeaturedIcon sx={{ mr: 1.5, fontSize: 20, color: colors.warning }} /> Remove Featured
            </>
          ) : (
            <>
              <FeaturedIcon sx={{ mr: 1.5, fontSize: 20, color: colors.highlight }} /> Mark Featured
            </>
          )}
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleDeletePolicy} 
          sx={{ color: colors.error }}
        >
          <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} /> Delete Policy
        </MenuItem>
      </Menu>

      {/* Policy Modal */}
      <Modal
        open={openPolicyModal}
        onClose={() => !isSubmitting && setOpenPolicyModal(false)}
        aria-labelledby="policy-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: '900px' },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          overflow: 'auto',
          outline: 'none'
        }}>
          <Box sx={{ 
            position: 'sticky', 
            top: 0, 
            bgcolor: colors.primary, 
            zIndex: 1,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
          }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              {isEditing ? 'Edit Policy' : 'Create New Policy'}
            </Typography>
            <IconButton 
              onClick={() => !isSubmitting && setOpenPolicyModal(false)} 
              size="small"
              sx={{ color: 'white' }}
              disabled={isSubmitting}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Policy Name"
                    value={newPolicy.name}
                    onChange={(e) => handlePolicyChange('name', e.target.value)}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={newPolicy.category}
                      onChange={(e) => handlePolicyChange('category', e.target.value)}
                      required
                      variant="outlined"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getCategoryIcon(category)}
                            {category}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={newPolicy.description}
                    onChange={(e) => handlePolicyChange('description', e.target.value)}
                    required
                    variant="outlined"
                    size="small"
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={newPolicy.company}
                      onChange={(e) => handlePolicyChange('company', e.target.value)}
                      required
                      variant="outlined"
                      displayEmpty
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
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newPolicy.isFeatured}
                          onChange={(e) => handlePolicyChange('isFeatured', e.target.checked)}
                          color="warning"
                        />
                      }
                      label="Featured Policy"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newPolicy.isActive}
                          onChange={(e) => handlePolicyChange('isActive', e.target.checked)}
                          color="success"
                        />
                      }
                      label="Active"
                    />
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Coverage Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {newPolicy.coverageDetails.map((detail, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        value={detail}
                        onChange={(e) => handleArrayFieldChange('coverageDetails', index, e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Enter coverage detail"
                      />
                      <IconButton
                        onClick={() => removeArrayFieldItem('coverageDetails', index)}
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayFieldItem('coverageDetails')}
                    sx={{ mt: 1 }}
                  >
                    Add Coverage Detail
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Policy Features
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {newPolicy.features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        value={feature}
                        onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Enter feature"
                      />
                      <IconButton
                        onClick={() => removeArrayFieldItem('features', index)}
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayFieldItem('features')}
                    sx={{ mt: 1 }}
                  >
                    Add Feature
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Requirements
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {newPolicy.requirements.map((requirement, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        value={requirement}
                        onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Enter requirement"
                      />
                      <IconButton
                        onClick={() => removeArrayFieldItem('requirements', index)}
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayFieldItem('requirements')}
                    sx={{ mt: 1 }}
                  >
                    Add Requirement
                  </Button>
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Premium Options
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {newPolicy.premiumOptions.map((option, index) => (
                    <Box key={index} sx={{ mb: 3, p: 2, border: `1px solid ${colors.border}`, borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Option Type"
                            value={option.type}
                            onChange={(e) => handlePremiumOptionChange(index, 'type', e.target.value)}
                            variant="outlined"
                            size="small"
                            placeholder="e.g., Annual, Monthly"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Amount"
                            value={option.amount}
                            onChange={(e) => handlePremiumOptionChange(index, 'amount', e.target.value)}
                            variant="outlined"
                            size="small"
                            placeholder="e.g., ₹12,500"
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Discount"
                            value={option.discount}
                            onChange={(e) => handlePremiumOptionChange(index, 'discount', e.target.value)}
                            variant="outlined"
                            size="small"
                            placeholder="e.g., 10%"
                          />
                        </Grid>
                        <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            onClick={() => removePremiumOption(index)}
                            color="error"
                          >
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addPremiumOption}
                    sx={{ mt: 1 }}
                  >
                    Add Premium Option
                  </Button>
                </Grid>
              </Grid>
            )}

            {activeStep === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Policy Documents
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload PDF documents related to this policy (terms & conditions, policy wording, etc.)
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
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
                        accept=".pdf"
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Accepted format: PDF (Max 10MB each)
                    </Typography>
                  </Box>

                  {uploadedFiles.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>New Files to Upload:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {uploadedFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => removeFile(index)}
                            variant="outlined"
                            size="small"
                            icon={<PdfIcon color="error" fontSize="small" />}
                            sx={{ maxWidth: 200 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {newPolicy.documents.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Existing Documents:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {newPolicy.documents.map((doc, index) => (
                          <Chip
                            key={index}
                            label={doc}
                            variant="outlined"
                            size="small"
                            icon={<PdfIcon color="error" fontSize="small" />}
                            sx={{ maxWidth: 200 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}

            {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBackStep}
                sx={{ textTransform: 'none' }}
              >
                Back
              </Button>
              
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: colors.primary,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#303f9f'
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmitPolicy}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                  sx={{
                    backgroundColor: colors.success,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#2e7d32'
                    }
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Policy'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PolicyManagement;