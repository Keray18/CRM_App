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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Tooltip
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
  ExpandMore as ExpandMoreIcon,
  Business as CompanyIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  MonetizationOn as PremiumIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const MasterDataManagement = () => {
  // State for different master data sections
  const [activeTab, setActiveTab] = useState('policyTypes');
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Master data states
  const [policyTypes, setPolicyTypes] = useState([
    { 
      id: 1, 
      name: 'Vehicle Insurance', 
      code: 'VEH', 
      isActive: true,
      description: 'Comprehensive coverage for vehicles',
      features: ['Third Party Liability', 'Own Damage', 'Personal Accident Cover'],
      requirements: ['RC Copy', 'Previous Policy', 'ID Proof']
    },
    { 
      id: 2, 
      name: 'Health Insurance', 
      code: 'HLT', 
      isActive: true,
      description: 'Medical coverage for individuals and families',
      features: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization'],
      requirements: ['Age Proof', 'Medical History', 'Address Proof']
    },
    { 
      id: 3, 
      name: 'Travel Insurance', 
      code: 'TRV', 
      isActive: true,
      description: 'Coverage for travel-related risks',
      features: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss'],
      requirements: ['Passport Copy', 'Travel Itinerary', 'Visa Details']
    }
  ]);

  const [insuranceCompanies, setInsuranceCompanies] = useState([
    { 
      id: 1, 
      name: 'TATA AIG GIC', 
      code: 'TATA', 
      isActive: true,
      description: 'Leading general insurance company',
      contact: {
        email: 'support@tataaig.com',
        phone: '1800-266-7780',
        website: 'www.tataaig.com'
      }
    },
    { 
      id: 2, 
      name: 'ICICI Lombard GIC', 
      code: 'ICICI', 
      isActive: true,
      description: 'One of the largest private sector general insurance companies',
      contact: {
        email: 'support@icicilombard.com',
        phone: '1800-266-7780',
        website: 'www.icicilombard.com'
      }
    },
    { 
      id: 3, 
      name: 'HDFC ERGO', 
      code: 'HDFC', 
      isActive: true,
      description: 'Leading private sector general insurance company',
      contact: {
        email: 'support@hdfcergo.com',
        phone: '1800-266-7780',
        website: 'www.hdfcergo.com'
      }
    }
  ]);

  const [vehicleTypes, setVehicleTypes] = useState([
    { 
      id: 1, 
      name: 'Private Car', 
      code: 'PC', 
      isActive: true,
      description: 'Insurance for personal cars',
      premiumFactors: ['Make & Model', 'Age of Vehicle', 'Location']
    },
    { 
      id: 2, 
      name: 'Two-Wheeler', 
      code: 'TW', 
      isActive: true,
      description: 'Insurance for motorcycles and scooters',
      premiumFactors: ['CC', 'Age of Vehicle', 'Location']
    },
    { 
      id: 3, 
      name: 'Commercial Vehicle', 
      code: 'CV', 
      isActive: true,
      description: 'Insurance for commercial vehicles',
      premiumFactors: ['Type', 'Usage', 'Location']
    }
  ]);

  const [healthPlans, setHealthPlans] = useState([
    { 
      id: 1, 
      name: 'Individual', 
      code: 'IND', 
      isActive: true,
      description: 'Health insurance for single person',
      coverage: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization']
    },
    { 
      id: 2, 
      name: 'Family Floater', 
      code: 'FF', 
      isActive: true,
      description: 'Health insurance for entire family',
      coverage: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization']
    },
    { 
      id: 3, 
      name: 'Senior Citizen', 
      code: 'SC', 
      isActive: true,
      description: 'Health insurance for senior citizens',
      coverage: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization']
    }
  ]);

  const [travelTypes, setTravelTypes] = useState([
    { 
      id: 1, 
      name: 'Individual', 
      code: 'IND', 
      isActive: true,
      description: 'Travel insurance for single person',
      coverage: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss']
    },
    { 
      id: 2, 
      name: 'Family', 
      code: 'FAM', 
      isActive: true,
      description: 'Travel insurance for family',
      coverage: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss']
    },
    { 
      id: 3, 
      name: 'Student', 
      code: 'STU', 
      isActive: true,
      description: 'Travel insurance for students',
      coverage: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss']
    }
  ]);

  // Form state for adding/editing items
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
    features: [],
    requirements: [],
    contact: {
      email: '',
      phone: '',
      website: ''
    },
    premiumFactors: [],
    coverage: []
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddItem = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      isActive: true,
      features: [],
      requirements: [],
      contact: {
        email: '',
        phone: '',
        website: ''
      },
      premiumFactors: [],
      coverage: []
    });
    setOpenModal(true);
  };

  const handleEditItem = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description || '',
      isActive: item.isActive,
      features: item.features || [],
      requirements: item.requirements || [],
      contact: item.contact || {
        email: '',
        phone: '',
        website: ''
      },
      premiumFactors: item.premiumFactors || [],
      coverage: item.coverage || []
    });
    setOpenModal(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    // Show confirmation dialog
  };

  const handleSaveItem = () => {
    // Validate form data
    if (!formData.name || !formData.code) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Save logic based on active tab
    switch (activeTab) {
      case 'policyTypes':
        if (isEditing) {
          setPolicyTypes(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
        } else {
          setPolicyTypes(prev => [...prev, { 
            id: Date.now(), 
            ...formData 
          }]);
        }
        break;
      case 'companies':
        if (isEditing) {
          setInsuranceCompanies(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
        } else {
          setInsuranceCompanies(prev => [...prev, { 
            id: Date.now(), 
            ...formData 
          }]);
        }
        break;
      case 'vehicleTypes':
        if (isEditing) {
          setVehicleTypes(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
        } else {
          setVehicleTypes(prev => [...prev, { 
            id: Date.now(), 
            ...formData 
          }]);
        }
        break;
      case 'healthPlans':
        if (isEditing) {
          setHealthPlans(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
        } else {
          setHealthPlans(prev => [...prev, { 
            id: Date.now(), 
            ...formData 
          }]);
        }
        break;
      case 'travelTypes':
        if (isEditing) {
          setTravelTypes(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...formData } : item
          ));
        } else {
          setTravelTypes(prev => [...prev, { 
            id: Date.now(), 
            ...formData 
          }]);
        }
        break;
    }

    setSnackbar({
      open: true,
      message: `${isEditing ? 'Updated' : 'Added'} successfully`,
      severity: 'success'
    });
    setOpenModal(false);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'policyTypes': return policyTypes;
      case 'companies': return insuranceCompanies;
      case 'vehicleTypes': return vehicleTypes;
      case 'healthPlans': return healthPlans;
      case 'travelTypes': return travelTypes;
      default: return [];
    }
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active"
          />
        </Grid>
      </>
    );

    switch (activeTab) {
      case 'policyTypes':
        return (
          <>
            {commonFields}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Features</Typography>
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData({ ...formData, features: newFeatures });
                    }}
                  />
                  <IconButton onClick={() => {
                    const newFeatures = formData.features.filter((_, i) => i !== index);
                    setFormData({ ...formData, features: newFeatures });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
              >
                Add Feature
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Requirements</Typography>
              {formData.requirements.map((requirement, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    value={requirement}
                    onChange={(e) => {
                      const newRequirements = [...formData.requirements];
                      newRequirements[index] = e.target.value;
                      setFormData({ ...formData, requirements: newRequirements });
                    }}
                  />
                  <IconButton onClick={() => {
                    const newRequirements = formData.requirements.filter((_, i) => i !== index);
                    setFormData({ ...formData, requirements: newRequirements });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setFormData({ ...formData, requirements: [...formData.requirements, ''] })}
              >
                Add Requirement
              </Button>
            </Grid>
          </>
        );
      case 'companies':
        return (
          <>
            {commonFields}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
              <TextField
                fullWidth
                label="Email"
                value={formData.contact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={formData.contact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value }
                })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Website"
                value={formData.contact.website}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, website: e.target.value }
                })}
              />
            </Grid>
          </>
        );
      case 'vehicleTypes':
        return (
          <>
            {commonFields}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Premium Factors</Typography>
              {formData.premiumFactors.map((factor, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    value={factor}
                    onChange={(e) => {
                      const newFactors = [...formData.premiumFactors];
                      newFactors[index] = e.target.value;
                      setFormData({ ...formData, premiumFactors: newFactors });
                    }}
                  />
                  <IconButton onClick={() => {
                    const newFactors = formData.premiumFactors.filter((_, i) => i !== index);
                    setFormData({ ...formData, premiumFactors: newFactors });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setFormData({ ...formData, premiumFactors: [...formData.premiumFactors, ''] })}
              >
                Add Premium Factor
              </Button>
            </Grid>
          </>
        );
      case 'healthPlans':
      case 'travelTypes':
        return (
          <>
            {commonFields}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Coverage</Typography>
              {formData.coverage.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    value={item}
                    onChange={(e) => {
                      const newCoverage = [...formData.coverage];
                      newCoverage[index] = e.target.value;
                      setFormData({ ...formData, coverage: newCoverage });
                    }}
                  />
                  <IconButton onClick={() => {
                    const newCoverage = formData.coverage.filter((_, i) => i !== index);
                    setFormData({ ...formData, coverage: newCoverage });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setFormData({ ...formData, coverage: [...formData.coverage, ''] })}
              >
                Add Coverage Item
              </Button>
            </Grid>
          </>
        );
      default:
        return commonFields;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: "#333" }}>
        Master Data Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
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
          <Tab label="Policy Types" value="policyTypes" />
          <Tab label="Insurance Companies" value="companies" />
          <Tab label="Vehicle Types" value="vehicleTypes" />
          <Tab label="Health Plans" value="healthPlans" />
          <Tab label="Travel Types" value="travelTypes" />
        </Tabs>
      </Box>

      {/* Add Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{
            backgroundColor: "#0C47A0",
            textTransform: 'none',
            '&:hover': {
              backgroundColor: "#1565C0"
            }
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentData().map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Tooltip title={item.description}>
                    <Typography sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.isActive ? 'Active' : 'Inactive'} 
                    color={item.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditItem(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="master-data-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {isEditing ? 'Edit' : 'Add New'} {activeTab}
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {renderFormFields()}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveItem}
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: "#0C47A0",
                '&:hover': {
                  backgroundColor: "#1565C0"
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
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

export default MasterDataManagement;