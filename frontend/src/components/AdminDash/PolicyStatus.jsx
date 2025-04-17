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
  FormHelperText
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
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  Info as InfoIcon
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

const PolicyStatus = ({ leads = [] }) => {
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
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState({
    vehicle: ['Vehicle & Customer Details', 'Premium Details', 'Commission Details'],
    health: ['Health Insurance Details', 'Commission Details'],
    travel: ['Travel Insurance Details', 'Commission Details']
  });
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [errors, setErrors] = useState({});

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

  // New policy form state
  const [newPolicy, setNewPolicy] = useState({
    policyNumber: '',
    insuredName: '',
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
    // Premium details
    basicPremium: '',
    odPremium: '',
    tpPremium: '',
    ncbDiscount: '',
    addonPremium: '',
    gst: '',
    totalPremium: '',
    paymentMode: '',
    paymentReference: '',
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
    documents: [],
    // Add commission fields
    commissionAmount: '',
    commissionPercentage: '',
    // New fields for vehicle insurance commission
    commissionType: '',
    odCommissionPercentage: '',
    tpCommissionPercentage: '',
    addonCommissionPercentage: '',
    totalCommissionAmount: '',
    effectiveCommissionPercentage: '',
  });

  // Add useEffect to initialize policies
  useEffect(() => {
    // Initialize with some dummy policies for testing
    const initialPolicies = [
      {
        id: 'P1',
        policyNumber: 'POL001',
        insuredName: 'Test User',
        clientName: 'Test Client',
        mobile: '9876543210',
        email: 'test@example.com',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        company: 'TATA AIG GIC',
        business: 'New',
        type: 'vehicle',
        status: 'Live Policy',
        vehicleType: 'Private Car',
        vehicleNumber: 'MH01AB1234'
      }
    ];
    setPolicies(initialPolicies);
  }, []);

  // Add lead search handler
  const handleLeadSearch = (event) => {
    const searchTerm = event.target.value;
    setLeadSearchTerm(searchTerm);
    
    if (searchTerm.trim() === '') {
      setFilteredLeads([]);
      return;
    }

    // Filter active leads (not converted and not deleted)
    const activeLeads = leads.filter(lead => !lead.isConverted && !lead.isDeleted);
    
    const filtered = activeLeads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(filtered);
  };

  // Add lead selection handler
  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setNewPolicy(prev => ({
      ...prev,
      insuredName: lead.name,
      mobile: lead.phone,
      email: lead.email,
      type: lead.policyInterested || 'vehicle'
    }));
    setInsuranceType(lead.policyInterested || 'vehicle');
    setFilteredLeads([]);
    setLeadSearchTerm('');
  };

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

  // Add this new function to handle date changes specifically
  const handleDateChange = (field) => (event) => {
    const value = event.target.value;
    console.log(`Setting ${field} to:`, value); // Debug log
    
    setNewPolicy(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('Updated policy state:', updated); // Debug log
      return updated;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Update the handleNewPolicyChange function
  const handleNewPolicyChange = (field) => (event) => {
    const value = event.target.value;
    console.log(`Setting ${field} to:`, value); // Debug log
    
    if (field === 'startDate' || field === 'endDate') {
      // For date fields, ensure we have a valid date string
      const dateValue = value || new Date().toISOString().split('T')[0];
      console.log(`Setting date ${field} to:`, dateValue); // Debug log
      
      setNewPolicy(prev => {
        const updated = {
          ...prev,
          [field]: dateValue
        };
        console.log('Updated policy state:', updated); // Debug log
        return updated;
      });
      
      // Clear error for this field
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined
        }));
      }
    } else if (['basicPremium', 'totalPremium', 'commissionAmount', 'commissionPercentage', 'age', 'tripDuration'].includes(field)) {
      // Handle numeric fields
      setNewPolicy(prev => ({
        ...prev,
        [field]: value === '' ? '' : Number(value)
      }));
    } else {
      // Handle all other fields
      setNewPolicy(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const calculateCommission = (policy) => {
    if (!policy.commissionType) return;

    let totalCommission = 0;
    let effectivePercentage = 0;

    // Convert string values to numbers and ensure they are valid
    const odPremium = parseFloat(policy.odPremium) || 0;
    const tpPremium = parseFloat(policy.tpPremium) || 0;
    const addonPremium = parseFloat(policy.addonPremium) || 0;
    const odCommissionPercentage = parseFloat(policy.odCommissionPercentage) || 0;
    const tpCommissionPercentage = parseFloat(policy.tpCommissionPercentage) || 0;
    const addonCommissionPercentage = parseFloat(policy.addonCommissionPercentage) || 0;

    switch (policy.commissionType) {
      case 'OD':
<<<<<<< HEAD
        // Commission on Own Damage only
=======
>>>>>>> 280946c410c54a1fa21538d7165c631969060f8c
        totalCommission = (odPremium * odCommissionPercentage) / 100;
        effectivePercentage = odCommissionPercentage;
        break;

<<<<<<< HEAD
      case 'TP_OD_ADDON':
        // Commission on TP + OD + Add-on
        const totalPremium = odPremium + tpPremium + addonPremium;
        const commissionPercentage = parseFloat(policy.commissionPercentage) || 0;
        totalCommission = (totalPremium * commissionPercentage) / 100;
        effectivePercentage = commissionPercentage;
        break;

      case 'BOTH':
        // Commission on Both (TP + OD%)
        const odAmount = (odPremium * odCommissionPercentage) / 100;
        const tpAmount = (tpPremium * tpCommissionPercentage) / 100;
=======
      case 'TP_OD':
        const totalPremium = odPremium + tpPremium + addonPremium;
        const odCommission = (odPremium * odCommissionPercentage) / 100;
        const tpCommission = (tpPremium * tpCommissionPercentage) / 100;
        const addonCommission = (addonPremium * addonCommissionPercentage) / 100;
        
        totalCommission = odCommission + tpCommission + addonCommission;
        effectivePercentage = totalPremium > 0 ? (totalCommission / totalPremium) * 100 : 0;
        break;

      case 'BOTH':
        const odAmount = (odPremium * odCommissionPercentage) / 100;
        const tpAmount = (tpPremium * tpCommissionPercentage) / 100;
        
>>>>>>> 280946c410c54a1fa21538d7165c631969060f8c
        totalCommission = odAmount + tpAmount;
        const totalBaseAmount = odPremium + tpPremium;
        effectivePercentage = totalBaseAmount > 0 ? (totalCommission / totalBaseAmount) * 100 : 0;
        break;

      default:
        break;
    }

    // Update the commission amounts in the policy
    const updatedPolicy = {
      ...policy,
      commissionAmount: totalCommission.toFixed(2),
      commissionPercentage: effectivePercentage.toFixed(2),
      totalCommissionAmount: totalCommission.toFixed(2),
      effectiveCommissionPercentage: effectivePercentage.toFixed(2)
    };

    setNewPolicy(updatedPolicy);
    return updatedPolicy;
  };

  // Add useEffect to calculate commission when relevant fields change
  useEffect(() => {
    if (insuranceType === 'vehicle') {
      calculateCommission(newPolicy);
    }
  }, [
    newPolicy.commissionType,
    newPolicy.odPremium,
    newPolicy.odCommissionPercentage,
    newPolicy.tpPremium,
    newPolicy.tpCommissionPercentage,
    newPolicy.addonPremium,
    newPolicy.addonCommissionPercentage
  ]);

  // Update the validateForm function
  const validateForm = () => {
    const newErrors = {};
    
    // Common validations for all insurance types
    if (!newPolicy.policyNumber?.trim()) newErrors.policyNumber = 'Policy Number is required';
    if (!newPolicy.insuredName?.trim()) newErrors.insuredName = 'Insured Name is required';
    if (!newPolicy.mobile?.trim()) newErrors.mobile = 'Mobile Number is required';
    if (!newPolicy.email?.trim()) newErrors.email = 'Email is required';
    if (!newPolicy.company?.trim()) newErrors.company = 'Insurance Company is required';
    if (!newPolicy.business?.trim()) newErrors.business = 'Policy Type is required';

    // Date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newPolicy.startDate) {
      newErrors.startDate = 'Start Date is required';
    } else {
      const startDate = new Date(newPolicy.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = 'Start Date cannot be in the past';
      }
    }

    if (!newPolicy.endDate) {
      newErrors.endDate = 'End Date is required';
    } else if (newPolicy.startDate) {
      const startDate = new Date(newPolicy.startDate);
      const endDate = new Date(newPolicy.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      if (endDate <= startDate) {
        newErrors.endDate = 'End Date must be after Start Date';
      }
    }

    // Vehicle specific validations
    if (insuranceType === 'vehicle') {
      if (!newPolicy.vehicleType?.trim()) newErrors.vehicleType = 'Vehicle Type is required';
      if (!newPolicy.vehicleNumber?.trim()) newErrors.vehicleNumber = 'Vehicle Number is required';
      
      // Premium validations for vehicle insurance
      if (!newPolicy.basicPremium || newPolicy.basicPremium <= 0) {
        newErrors.basicPremium = 'Basic Premium is required and must be greater than 0';
      }
      if (!newPolicy.totalPremium || newPolicy.totalPremium <= 0) {
        newErrors.totalPremium = 'Total Premium is required and must be greater than 0';
      }

      // Commission validations for vehicle insurance
      if (!newPolicy.commissionType) {
        newErrors.commissionType = 'Please select commission type';
      }

      if (newPolicy.commissionType === 'OD' || newPolicy.commissionType === 'TP_OD' || newPolicy.commissionType === 'BOTH') {
        if (!newPolicy.odPremium || newPolicy.odPremium <= 0) {
          newErrors.odPremium = 'OD Premium is required and must be greater than 0';
        }
        if (!newPolicy.odCommissionPercentage || newPolicy.odCommissionPercentage <= 0 || newPolicy.odCommissionPercentage > 100) {
          newErrors.odCommissionPercentage = 'OD Commission Percentage must be between 0 and 100';
        }
      }

      if (newPolicy.commissionType === 'TP_OD' || newPolicy.commissionType === 'BOTH') {
        if (!newPolicy.tpPremium || newPolicy.tpPremium <= 0) {
          newErrors.tpPremium = 'TP Premium is required and must be greater than 0';
        }
        if (!newPolicy.tpCommissionPercentage || newPolicy.tpCommissionPercentage <= 0 || newPolicy.tpCommissionPercentage > 100) {
          newErrors.tpCommissionPercentage = 'TP Commission Percentage must be between 0 and 100';
        }
      }

      if (newPolicy.commissionType === 'TP_OD' && newPolicy.addonPremium > 0) {
        if (!newPolicy.addonCommissionPercentage || newPolicy.addonCommissionPercentage <= 0 || newPolicy.addonCommissionPercentage > 100) {
          newErrors.addonCommissionPercentage = 'Add-on Commission Percentage must be between 0 and 100';
        }
      }
    }

    // Health specific validations
    if (insuranceType === 'health') {
      if (!newPolicy.healthPlan?.trim()) newErrors.healthPlan = 'Health Plan is required';
      if (!newPolicy.sumInsured || newPolicy.sumInsured <= 0) {
        newErrors.sumInsured = 'Sum Insured is required and must be greater than 0';
      }
      if (!newPolicy.dateOfBirth?.trim()) newErrors.dateOfBirth = 'Date of Birth is required';
      if (!newPolicy.height || newPolicy.height <= 0) {
        newErrors.height = 'Height is required and must be greater than 0';
      }
      if (!newPolicy.weight || newPolicy.weight <= 0) {
        newErrors.weight = 'Weight is required and must be greater than 0';
      }
      if (!newPolicy.bloodGroup?.trim()) newErrors.bloodGroup = 'Blood Group is required';
      if (!newPolicy.preExistingConditions || newPolicy.preExistingConditions.length === 0) {
        newErrors.preExistingConditions = 'Please select at least one option (or None)';
      }
      // Only require family members for Family Floater plan
      if (newPolicy.healthPlan === 'Family Floater Plan' && (!newPolicy.familyMembers || newPolicy.familyMembers <= 0)) {
        newErrors.familyMembers = 'Please select number of family members';
      }
    }

    // Travel specific validations
    if (insuranceType === 'travel') {
      if (!newPolicy.travelType?.trim()) newErrors.travelType = 'Travel Type is required';
      if (!newPolicy.destination?.trim()) newErrors.destination = 'Destination is required';
      if (!newPolicy.tripDuration || newPolicy.tripDuration <= 0) {
        newErrors.tripDuration = 'Trip Duration is required and must be greater than 0';
      }
    }

    console.log('Validation Errors:', newErrors); // Debug log
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPolicy = async () => {
    console.log('Attempting to add policy...'); // Debug log
    
    // Set default dates if not provided
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearDate = nextYear.toISOString().split('T')[0];

    // Update policy with default dates if not set
    const policyWithDates = {
      ...newPolicy,
      startDate: newPolicy.startDate || today,
      endDate: newPolicy.endDate || nextYearDate
    };
    setNewPolicy(policyWithDates);

    // Calculate commission first
    if (insuranceType === 'vehicle') {
      const updatedPolicy = calculateCommission(policyWithDates);
      setNewPolicy(updatedPolicy);
    }

    const isValid = validateForm();
    console.log('Form validation result:', isValid); // Debug log

    if (!isValid) {
      console.log('Current Errors:', errors); // Debug log
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const policyToAdd = {
        id: `P${Date.now()}`,
        ...policyWithDates,
        type: insuranceType,
        status: 'Live Policy',
        documents: uploadedFiles.map(file => file.name),
      };

      console.log('Adding policy:', policyToAdd); // Debug log

      // Add policy to the list
      setPolicies(prevPolicies => [...prevPolicies, policyToAdd]);
      
      setSnackbar({
        open: true,
        message: 'Policy created successfully',
        severity: 'success'
      });

      // Reset form and close modal
      setOpenNewPolicy(false);
      resetForm();
      handleReset();
      setSelectedLead(null);
    } catch (error) {
      console.error('Error creating policy:', error);
      setSnackbar({
        open: true,
        message: 'Error creating policy. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the resetForm function
  const resetForm = () => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const nextYearStr = nextYear.toISOString().split('T')[0];

    setNewPolicy({
      ...newPolicy,
      policyNumber: '',
      insuredName: '',
      mobile: '',
      email: '',
      startDate: todayStr,
      endDate: nextYearStr,
      company: '',
      business: 'New',
      type: 'vehicle',
      vehicleType: '',
      vehicleNumber: '',
      make: '',
      model: '',
      year: '',
      basicPremium: '',
      odPremium: '',
      tpPremium: '',
      ncbDiscount: '',
      addonPremium: '',
      gst: '',
      totalPremium: '',
      paymentMode: '',
      paymentReference: '',
      healthPlan: '',
      sumInsured: '',
      age: '',
      preExisting: 'No',
      travelType: '',
      destination: '',
      tripDuration: '',
      commissionAmount: '',
      commissionPercentage: '',
      documents: []
    });
    setUploadedFiles([]);
    setInsuranceType('vehicle');
    setErrors({});
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
    if (!newPolicy.policyNumber || !newPolicy.insuredName || !newPolicy.endDate || !newPolicy.company || !newPolicy.business) {
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
      documents: [],
      commissionAmount: '',
      commissionPercentage: '',
    });
  };

  // Add cleanup for modal closes
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPolicy(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: "#000000" }}>
        Policy Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#000000',
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 100,
              '&.Mui-selected': {
                color: '#1976d2'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2'
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
                  color: '#000000'
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
                color: '#000000'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#000000' }} />
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
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          New Policy
        </Button>
      </Box>

      {/* Policies Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', mt: 3, backgroundColor: '#ffffff' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Policy Number</TableCell>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Insured Name</TableCell>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Company</TableCell>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Business</TableCell>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id} hover sx={{ backgroundColor: '#ffffff' }}>
                <TableCell sx={{ color: '#000000' }}>{policy.policyNumber}</TableCell>
                <TableCell sx={{ color: '#000000' }}>{policy.insuredName}</TableCell>
                <TableCell sx={{ color: '#000000' }}>{policy.endDate}</TableCell>
                <TableCell sx={{ color: '#000000' }}>{policy.company}</TableCell>
                <TableCell sx={{ color: '#000000' }}>{policy.business}</TableCell>
                <TableCell sx={{ color: '#000000' }}>
                  <Chip 
                    label={policy.status} 
                    size="small"
                    color={getStatusColor(policy.status)}
                  />
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

      {/* New Policy Modal */}
      <Modal
        open={openNewPolicy}
        onClose={() => {
          setOpenNewPolicy(false);
          resetForm();
          handleReset();
          setSelectedLead(null);
        }}
        aria-labelledby="new-policy-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: '800px' },
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
              handleReset();
              setSelectedLead(null);
            }} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Lead Search Section */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              backgroundColor: '#f0f7ff', 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #1976d2'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                Search Lead
              </Typography>
              <TextField
                fullWidth
                placeholder="Search by name, phone, or email"
                value={leadSearchTerm}
                onChange={handleLeadSearch}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'black',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              {filteredLeads.length > 0 && (
                <Box sx={{ 
                  mt: 2, 
                  maxHeight: 300, 
                  overflow: 'auto',
                  border: '2px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {filteredLeads.map((lead) => (
                    <Box
                      key={lead._id}
                      onClick={() => handleLeadSelect(lead)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                          borderBottom: 'none'
                        },
                        '&:hover': {
                          backgroundColor: '#f0f7ff',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease-in-out'
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, fontSize: '0.875rem' }}>
                          {lead.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>
                            {lead.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                              <PhoneIcon sx={{ mr: 0.5, color: '#1976d2', fontSize: 16 }} />
                              {lead.phone}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                              <EmailIcon sx={{ mr: 0.5, color: '#1976d2', fontSize: 16 }} />
                              {lead.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                              <CalendarTodayIcon sx={{ mr: 0.5, color: '#1976d2', fontSize: 16 }} />
                              Added: {new Date(lead.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                              <InfoIcon sx={{ mr: 0.5, color: '#1976d2', fontSize: 16 }} />
                              {lead.remarks}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              {selectedLead && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: 2,
                  border: '2px solid #2e7d32',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 1 }}>
                    Selected Lead
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#2e7d32', width: 40, height: 40, fontSize: '1rem' }}>
                      {selectedLead.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>
                        {selectedLead.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                          <PhoneIcon sx={{ mr: 0.5, color: '#2e7d32', fontSize: 16 }} />
                          {selectedLead.phone}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                          <EmailIcon sx={{ mr: 0.5, color: '#2e7d32', fontSize: 16 }} />
                          {selectedLead.email}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', color: 'black' }}>
                        <InfoIcon sx={{ mr: 0.5, color: '#2e7d32', fontSize: 16 }} />
                        {selectedLead.remarks}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

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

            {/* Stepper */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps[insuranceType].map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Grid container spacing={3}>
              {/* Step 1: Vehicle & Customer Details */}
              {activeStep === 0 && insuranceType === 'vehicle' && (
                <>
                  {/* Document Upload Section */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: 'white', fontWeight: 'bold', fontSize: '1.3rem' }}>
                      Required Documents
                    </Typography>
                    <Box sx={{ 
                      p: 3, 
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      mb: 3
                    }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 3, 
                            border: '1px dashed #1976d2',
                            borderRadius: 1,
                            backgroundColor: '#f8f9fa'
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                              Upload Documents
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666666', mb: 3 }}>
                              Required documents for vehicle insurance:
                              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                                <li>Registration Certificate (RC Book)</li>
                                <li>Previous Insurance Policy (if any)</li>
                                <li>Vehicle Photos (front, back, sides)</li>
                                <li>Invoice (for new vehicles)</li>
                                <li>Driving License</li>
                                <li>ID & Address Proof</li>
                              </Box>
                            </Typography>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              gap: 2
                            }}>
                              <Button
                                component="label"
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                fullWidth
                                sx={{
                                  py: 1.5,
                                  borderColor: '#1976d2',
                                  color: '#1976d2',
                                  backgroundColor: '#ffffff',
                                  '&:hover': {
                                    backgroundColor: '#f5f9ff',
                                    borderColor: '#1976d2'
                                  }
                                }}
                              >
                                Select Documents
                                <VisuallyHiddenInput 
                                  type="file"
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    files.forEach(file => {
                                      setUploadedFiles(prev => [...prev, { 
                                        type: 'Vehicle Document', 
                                        file,
                                        uploadDate: new Date().toLocaleString()
                                      }]);
                                    });
                                  }}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  multiple
                                />
                              </Button>

                              {/* Display Uploaded Files */}
                              {uploadedFiles.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                                    Uploaded Documents ({uploadedFiles.length})
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    gap: 1
                                  }}>
                                    {uploadedFiles.map((file, index) => (
                                      <Box
                                        key={index}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          p: 1.5,
                                          borderRadius: 1,
                                          backgroundColor: '#e3f2fd',
                                          border: '1px solid #90caf9'
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Description sx={{ color: '#1976d2' }} />
                                          <Box>
                                            <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                                              {file.file.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#666666' }}>
                                              {file.uploadDate}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => removeFile(index)}
                                          sx={{ 
                                            color: '#d32f2f',
                                            '&:hover': {
                                              backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                            }
                                          }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Existing Vehicle & Customer Details */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                      Vehicle & Customer Details
                    </Typography>
                    <Divider />
                  </Grid>

                  {/* Common Fields */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Policy Number"
                      value={newPolicy.policyNumber}
                      onChange={handleNewPolicyChange('policyNumber')}
                      error={!!errors.policyNumber}
                      helperText={errors.policyNumber}
                      color='white'
                      required
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.business}>
                      <InputLabel sx={{ color: '#ffffff' }}>Policy Type</InputLabel>
                      <Select
                        value={newPolicy.business}
                        onChange={handleNewPolicyChange('business')}
                        label="Policy Type"
                        sx={{ color: '#ffffff' }}
                      >
                        <MenuItem value="New">New Policy</MenuItem>
                        <MenuItem value="Renewal">Policy Renewal</MenuItem>
                      </Select>
                      {errors.business && <Typography color="error" variant="caption" sx={{ color: '#ff0000' }}>{errors.business}</Typography>}
                    </FormControl>
                  </Grid>
                  
                  {/* Date Fields */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={newPolicy.startDate || ''}
                      onChange={handleNewPolicyChange('startDate')}
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={newPolicy.endDate || ''}
                      onChange={handleNewPolicyChange('endDate')}
                      error={!!errors.endDate}
                      helperText={errors.endDate}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Insured Name"
                      value={newPolicy.insuredName}
                      onChange={handleNewPolicyChange('insuredName')}
                      error={!!errors.insuredName}
                      helperText={errors.insuredName}
                      required
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.company}>
                      <InputLabel sx={{ color: '#ffffff' }}>Insurance Company</InputLabel>
                      <Select
                        value={newPolicy.company}
                        onChange={handleNewPolicyChange('company')}
                        label="Insurance Company"
                        sx={{ color: '#ffffff' }}
                      >
                        {insuranceCompanies.map((company) => (
                          <MenuItem key={company} value={company}>{company}</MenuItem>
                        ))}
                      </Select>
                      {errors.company && <Typography color="error" variant="caption" sx={{ color: '#ff0000' }}>{errors.company}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={newPolicy.mobile}
                      onChange={handleNewPolicyChange('mobile')}
                      type="tel"
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                      required
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={newPolicy.email}
                      onChange={handleNewPolicyChange('email')}
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>

                  {/* Vehicle Details */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                      Vehicle Details
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.vehicleType}>
                      <InputLabel sx={{ color: '#ffffff' }}>Vehicle Type</InputLabel>
                      <Select
                        value={newPolicy.vehicleType}
                        onChange={handleNewPolicyChange('vehicleType')}
                        label="Vehicle Type"
                        sx={{ color: '#ffffff' }}
                      >
                        {vehicleTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                      {errors.vehicleType && <Typography color="error" variant="caption" sx={{ color: '#ff0000' }}>{errors.vehicleType}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Registration Number"
                      value={newPolicy.vehicleNumber}
                      onChange={handleNewPolicyChange('vehicleNumber')}
                      error={!!errors.vehicleNumber}
                      helperText={errors.vehicleNumber}
                      required
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Make"
                      value={newPolicy.make}
                      onChange={handleNewPolicyChange('make')}
                      error={!!errors.make}
                      helperText={errors.make}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Model"
                      value={newPolicy.model}
                      onChange={handleNewPolicyChange('model')}
                      error={!!errors.model}
                      helperText={errors.model}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Manufacturing Year"
                      value={newPolicy.year}
                      onChange={handleNewPolicyChange('year')}
                      type="number"
                      error={!!errors.year}
                      helperText={errors.year}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Step 2: Premium Details */}
              {activeStep === 1 && insuranceType === 'vehicle' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                      Premium Details
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Basic Premium"
                      value={newPolicy.basicPremium}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleNewPolicyChange('basicPremium')({ target: { value } });
                        // Recalculate total premium
                        const basicPremium = parseFloat(value) || 0;
                        const ncbAmount = basicPremium * (parseFloat(newPolicy.ncbDiscount || 0) / 100);
                        const netPremium = basicPremium - ncbAmount;
                        const gstAmount = netPremium * 0.18; // 18% GST
                        const totalPremium = netPremium + gstAmount;
                        setNewPolicy(prev => ({
                          ...prev,
                          gst: gstAmount.toFixed(2),
                          totalPremium: totalPremium.toFixed(2)
                        }));
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!errors.basicPremium}
                      helperText={errors.basicPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="OD Premium"
                      value={newPolicy.odPremium}
                      onChange={handleNewPolicyChange('odPremium')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!errors.odPremium}
                      helperText={errors.odPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="TP Premium"
                      value={newPolicy.tpPremium}
                      onChange={handleNewPolicyChange('tpPremium')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!errors.tpPremium}
                      helperText={errors.tpPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="NCB Discount (%)"
                      value={newPolicy.ncbDiscount}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleNewPolicyChange('ncbDiscount')({ target: { value } });
                        // Recalculate total premium
                        const basicPremium = parseFloat(newPolicy.basicPremium) || 0;
                        const ncbAmount = basicPremium * (parseFloat(value || 0) / 100);
                        const netPremium = basicPremium - ncbAmount;
                        const gstAmount = netPremium * 0.18; // 18% GST
                        const totalPremium = netPremium + gstAmount;
                        setNewPolicy(prev => ({
                          ...prev,
                          gst: gstAmount.toFixed(2),
                          totalPremium: totalPremium.toFixed(2)
                        }));
                      }}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        inputProps: { min: 0, max: 50 } // NCB typically has a maximum of 50%
                      }}
                      error={!!errors.ncbDiscount}
                      helperText={errors.ncbDiscount}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                      error={!!errors.ncbDiscount}
                      helperText={errors.ncbDiscount}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Add-on Premium"
                      value={newPolicy.addonPremium}
                      onChange={handleNewPolicyChange('addonPremium')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!errors.addonPremium}
                      helperText={errors.addonPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="GST (18%)"
                      value={newPolicy.gst}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        readOnly: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { 
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      error={!!errors.gst}
                      helperText={errors.gst}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Total Premium"
                      value={newPolicy.totalPremium}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        readOnly: true,
                      }}
                      error={!!errors.totalPremium}
                      helperText={errors.totalPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { 
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      error={!!errors.totalPremium}
                      helperText={errors.totalPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth error={!!errors.paymentMode}>
                      <InputLabel sx={{ color: '#ffffff' }}>Payment Mode</InputLabel>
                      <Select
                        value={newPolicy.paymentMode}
                        onChange={handleNewPolicyChange('paymentMode')}
                        label="Payment Mode"
                        sx={{ color: '#ffffff' }}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Cheque">Cheque</MenuItem>
                        <MenuItem value="Online Transfer">Online Transfer</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                      </Select>
                      {errors.paymentMode && <Typography color="error" variant="caption" sx={{ color: '#ff0000' }}>{errors.paymentMode}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Payment Reference"
                      value={newPolicy.paymentReference}
                      onChange={handleNewPolicyChange('paymentReference')}
                      error={!!errors.paymentReference}
                      helperText={errors.paymentReference}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Step 3: Commission Details for Vehicle */}
              {activeStep === 2 && insuranceType === 'vehicle' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                      Commission Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  {/* Commission Type Selection */}
                  <Grid item xs={12}>
                    <FormControl fullWidth required error={!!errors.commissionType}>
                      <InputLabel sx={{ color: '#ffffff' }}>Commission Type</InputLabel>
                      <Select
                        value={newPolicy.commissionType || ''}
                        onChange={handleNewPolicyChange('commissionType')}
                        label="Commission Type"
                        sx={{ color: '#ffffff' }}
                      >
<<<<<<< HEAD
                        <MenuItem value="OD">Comm OD (Commission on Own Damage)</MenuItem>
                        <MenuItem value="TP_OD_ADDON">Comm A/ct (Commission on TP + OD + Add-on)</MenuItem>
                        <MenuItem value="BOTH">Comm Both (TP + OD%)</MenuItem>
=======
                        <MenuItem value="OD">Commission on OD Only</MenuItem>
                        <MenuItem value="TP_OD">Commission on TP + OD + Add-on</MenuItem>
                        <MenuItem value="BOTH">Commission on Both (TP + OD%)</MenuItem>
>>>>>>> 280946c410c54a1fa21538d7165c631969060f8c
                      </Select>
                      {errors.commissionType && (
                        <FormHelperText error>{errors.commissionType}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

<<<<<<< HEAD
                  {/* Commission Fields based on Type */}
                  {(newPolicy.commissionType === 'OD' || newPolicy.commissionType === 'BOTH') && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="OD Premium Amount"
                          value={newPolicy.odPremium || 0}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            readOnly: true,
                          }}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { 
                              color: '#ffffff',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="OD Commission Percentage"
                          value={newPolicy.odCommissionPercentage}
                          onChange={handleNewPolicyChange('odCommissionPercentage')}
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          error={!!errors.odCommissionPercentage}
                          helperText={errors.odCommissionPercentage}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {(newPolicy.commissionType === 'TP_OD_ADDON') && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Total Premium (TP + OD + Add-on)"
                          value={parseFloat(newPolicy.odPremium || 0) + parseFloat(newPolicy.tpPremium || 0) + parseFloat(newPolicy.addonPremium || 0)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            readOnly: true,
                          }}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { 
                              color: '#ffffff',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Commission Percentage"
                          value={newPolicy.commissionPercentage}
                          onChange={handleNewPolicyChange('commissionPercentage')}
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          error={!!errors.commissionPercentage}
                          helperText={errors.commissionPercentage}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {(newPolicy.commissionType === 'BOTH') && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="TP Premium Amount"
                          value={newPolicy.tpPremium || 0}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            readOnly: true,
                          }}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { 
                              color: '#ffffff',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="TP Commission Percentage"
                          value={newPolicy.tpCommissionPercentage}
                          onChange={handleNewPolicyChange('tpCommissionPercentage')}
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          error={!!errors.tpCommissionPercentage}
                          helperText={errors.tpCommissionPercentage}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Total Commission */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#ffffff' }}>
                      Total Commission
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Total Commission Amount"
                      value={newPolicy.totalCommissionAmount || '0.00'}
=======
                  {/* OD Commission */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="OD Premium Amount"
                      value={newPolicy.odPremium}
                      onChange={handleNewPolicyChange('odPremium')}
                      type="number"
>>>>>>> 280946c410c54a1fa21538d7165c631969060f8c
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        readOnly: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { 
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      error={!!errors.odPremium}
                      helperText={errors.odPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
<<<<<<< HEAD
                      label="Effective Commission Percentage"
                      value={newPolicy.effectiveCommissionPercentage || '0.00'}
=======
                      required
                      label="OD Commission Percentage"
                      value={newPolicy.odCommissionPercentage}
                      onChange={handleNewPolicyChange('odCommissionPercentage')}
                      type="number"
>>>>>>> 280946c410c54a1fa21538d7165c631969060f8c
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        readOnly: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { 
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      error={!!errors.odCommissionPercentage}
                      helperText={errors.odCommissionPercentage}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>

                  {/* TP Commission */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="TP Premium Amount"
                      value={newPolicy.tpPremium}
                      onChange={handleNewPolicyChange('tpPremium')}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!errors.tpPremium}
                      helperText={errors.tpPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="TP Commission Percentage"
                      value={newPolicy.tpCommissionPercentage}
                      onChange={handleNewPolicyChange('tpCommissionPercentage')}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      error={!!errors.tpCommissionPercentage}
                      helperText={errors.tpCommissionPercentage}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>

                  {/* Add-on Commission */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Add-on Premium Amount"
                      value={newPolicy.addonPremium}
                      onChange={handleNewPolicyChange('addonPremium')}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      error={!!errors.addonPremium}
                      helperText={errors.addonPremium}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Add-on Commission Percentage"
                      value={newPolicy.addonCommissionPercentage}
                      onChange={handleNewPolicyChange('addonCommissionPercentage')}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      error={!!errors.addonCommissionPercentage}
                      helperText={errors.addonCommissionPercentage}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>

                  {/* Total Commission */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#ffffff' }}>
                      Total Commission
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Total Commission Amount"
                      value={newPolicy.totalCommissionAmount}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        readOnly: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Effective Commission Percentage"
                      value={newPolicy.effectiveCommissionPercentage}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        readOnly: true,
                      }}
                      sx={{ 
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': { color: '#ffffff' }
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Health Insurance Form */}
              {insuranceType === 'health' && (
                <>
                  {/* Step 1: Health Insurance Details */}
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                          Health Insurance Details
                        </Typography>
                        <Divider />
                      </Grid>

                      {/* Basic Policy Details */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#ffffff' }}>
                          Basic Policy Details
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Policy Number"
                          value={newPolicy.policyNumber}
                          onChange={handleNewPolicyChange('policyNumber')}
                          error={!!errors.policyNumber}
                          helperText={errors.policyNumber}
                          sx={{
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required error={!!errors.company}>
                          <InputLabel sx={{ color: '#ffffff' }}>Insurance Company</InputLabel>
                          <Select
                            value={newPolicy.company}
                            onChange={handleNewPolicyChange('company')}
                            label="Insurance Company"
                            sx={{ color: '#ffffff' }}
                          >
                            {[
                              'Star Health Insurance',
                              'LIC Health Insurance',
                              'HDFC ERGO Health',
                              'Care Health Insurance',
                              'Niva Bupa Health Insurance',
                              'Aditya Birla Health Insurance',
                              'ICICI Lombard Health Insurance',
                              'Max Bupa Health Insurance'
                            ].map((company) => (
                              <MenuItem key={company} value={company}>{company}</MenuItem>
                            ))}
                          </Select>
                          {errors.company && (
                            <FormHelperText error>{errors.company}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required error={!!errors.healthPlan}>
                          <InputLabel sx={{ color: '#ffffff' }}>Health Plan</InputLabel>
                          <Select
                            value={newPolicy.healthPlan}
                            onChange={handleNewPolicyChange('healthPlan')}
                            label="Health Plan"
                            sx={{ color: '#ffffff' }}
                          >
                            {[
                              'Individual Health Plan',
                              'Family Floater Plan',
                              'Senior Citizen Health Plan',
                              'Critical Illness Plan',
                              'Maternity Health Plan',
                              'Group Health Plan'
                            ].map((plan) => (
                              <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                            ))}
                          </Select>
                          {errors.healthPlan && (
                            <FormHelperText error>{errors.healthPlan}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Sum Insured"
                          value={newPolicy.sumInsured}
                          onChange={handleNewPolicyChange('sumInsured')}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                          error={!!errors.sumInsured}
                          helperText={errors.sumInsured}
                          sx={{
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>

                      {/* Family Members Field - Only shown for Family Floater Plan */}
                      {newPolicy.healthPlan === 'Family Floater Plan' && (
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required error={!!errors.familyMembers}>
                            <InputLabel sx={{ color: '#ffffff' }}>Number of Family Members</InputLabel>
                            <Select
                              value={newPolicy.familyMembers || ''}
                              onChange={handleNewPolicyChange('familyMembers')}
                              label="Number of Family Members"
                              sx={{ color: '#ffffff' }}
                            >
                              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                                <MenuItem key={number} value={number}>{number} Members</MenuItem>
                              ))}
                            </Select>
                            {errors.familyMembers && (
                              <FormHelperText error>{errors.familyMembers}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      )}

                      {/* Primary Insured Details */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#ffffff' }}>
                          Primary Insured Details
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Full Name"
                          value={newPolicy.insuredName}
                          onChange={handleNewPolicyChange('insuredName')}
                          error={!!errors.insuredName}
                          helperText={errors.insuredName}
                          sx={{
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Date of Birth"
                          type="date"
                          value={newPolicy.dateOfBirth || ''}
                          onChange={handleNewPolicyChange('dateOfBirth')}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.dateOfBirth}
                          helperText={errors.dateOfBirth}
                          sx={{
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          required
                          label="Height (cm)"
                          type="number"
                          value={newPolicy.height}
                          onChange={handleNewPolicyChange('height')}
                          error={!!errors.height}
                          helperText={errors.height}
                          sx={{
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          required
                          label="Weight (kg)"
                          type="number"
                          value={newPolicy.weight}
                          onChange={handleNewPolicyChange('weight')}
                          error={!!errors.weight}
                          helperText={errors.weight}
                          sx={{
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth required error={!!errors.bloodGroup}>
                          <InputLabel sx={{ color: '#ffffff' }}>Blood Group</InputLabel>
                          <Select
                            value={newPolicy.bloodGroup || ''}
                            onChange={handleNewPolicyChange('bloodGroup')}
                            label="Blood Group"
                            sx={{ color: '#ffffff' }}
                          >
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                              <MenuItem key={group} value={group}>{group}</MenuItem>
                            ))}
                          </Select>
                          {errors.bloodGroup && (
                            <FormHelperText error>{errors.bloodGroup}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Medical History */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: 'white' }}>
                          Medical History
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required error={!!errors.preExistingConditions}>
                          <InputLabel>Pre-existing Conditions</InputLabel>
                          <Select
                            multiple
                            value={newPolicy.preExistingConditions || []}
                            onChange={handleNewPolicyChange('preExistingConditions')}
                            label="Pre-existing Conditions"
                            defaultValue="None"
                          >
                            {[
                              'None',
                              'Diabetes',
                              'Hypertension',
                              'Heart Disease',
                              'Asthma',
                              'Thyroid',
                              'Cancer',
                              'Other'
                            ].map((condition) => (
                              <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                            ))}
                          </Select>
                          {errors.preExistingConditions && (
                            <FormHelperText error>{errors.preExistingConditions}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Document Upload Section */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: 'white', fontWeight: 'bold', fontSize: '1.3rem' }}>
                          Required Documents
                        </Typography>
                        <Box sx={{ 
                          p: 3, 
                          border: '2px solid #e0e0e0',
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                          <Grid container spacing={3}>
                            {/* Age Proof */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px dashed #1976d2',
                                borderRadius: 1,
                                height: '100%',
                                backgroundColor: '#f8f9fa'
                              }}>
                                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                                  Age Proof Documents
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
                                  Upload any one of the following:
                                  <Box component="ul" sx={{ mt: 1, pl: 2, mb: 2 }}>
                                    <li>Passport</li>
                                    <li>PAN Card</li>
                                    <li>Driving License</li>
                                    <li>Aadhar Card</li>
                                  </Box>
                                </Typography>
                                <Button
                                  component="label"
                                  variant="outlined"
                                  startIcon={<UploadIcon />}
                                  fullWidth
                                  sx={{
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                      backgroundColor: '#f5f9ff',
                                      borderColor: '#1976d2'
                                    }
                                  }}
                                >
                                  Upload Age Proof
                                  <VisuallyHiddenInput 
                                    type="file" 
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setUploadedFiles(prev => [...prev, { type: 'Age Proof', file }]);
                                      }
                                    }}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                </Button>
                              </Box>
                            </Grid>

                            {/* ID Proof */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px dashed #1976d2',
                                borderRadius: 1,
                                height: '100%',
                                backgroundColor: '#f8f9fa'
                              }}>
                                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                                  ID Proof Documents
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
                                  Upload any one of the following:
                                  <Box component="ul" sx={{ mt: 1, pl: 2, mb: 2 }}>
                                    <li>Voter ID</li>
                                    <li>Passport</li>
                                    <li>Driving License</li>
                                    <li>Aadhar Card</li>
                                  </Box>
                                </Typography>
                                <Button
                                  component="label"
                                  variant="outlined"
                                  startIcon={<UploadIcon />}
                                  fullWidth
                                  sx={{
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                      backgroundColor: '#f5f9ff',
                                      borderColor: '#1976d2'
                                    }
                                  }}
                                >
                                  Upload ID Proof
                                  <VisuallyHiddenInput 
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setUploadedFiles(prev => [...prev, { type: 'ID Proof', file }]);
                                      }
                                    }}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                </Button>
                              </Box>
                            </Grid>

                            {/* Address Proof */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px dashed #1976d2',
                                borderRadius: 1,
                                height: '100%',
                                backgroundColor: '#f8f9fa'
                              }}>
                                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                                  Address Proof Documents
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
                                  Upload any one of the following:
                                  <Box component="ul" sx={{ mt: 1, pl: 2, mb: 2 }}>
                                    <li>Utility Bill</li>
                                    <li>Bank Statement</li>
                                    <li>Passport</li>
                                    <li>Aadhar Card</li>
                                  </Box>
                                </Typography>
                                <Button
                                  component="label"
                                  variant="outlined"
                                  startIcon={<UploadIcon />}
                                  fullWidth
                                  sx={{
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                      backgroundColor: '#f5f9ff',
                                      borderColor: '#1976d2'
                                    }
                                  }}
                                >
                                  Upload Address Proof
                                  <VisuallyHiddenInput 
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setUploadedFiles(prev => [...prev, { type: 'Address Proof', file }]);
                                      }
                                    }}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                </Button>
                              </Box>
                            </Grid>

                            {/* Medical Reports */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 2, 
                                border: '1px dashed #1976d2',
                                borderRadius: 1,
                                height: '100%',
                                backgroundColor: '#f8f9fa'
                              }}>
                                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                                  Medical Reports
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
                                  Upload any of the following:
                                  <Box component="ul" sx={{ mt: 1, pl: 2, mb: 2 }}>
                                    <li>Recent Medical Tests</li>
                                    <li>Health Check-up Reports</li>
                                    <li>Previous Policy Documents</li>
                                    <li>Other Medical Documents</li>
                                  </Box>
                                </Typography>
                                <Button
                                  component="label"
                                  variant="outlined"
                                  startIcon={<UploadIcon />}
                                  fullWidth
                                  sx={{
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                      backgroundColor: '#f5f9ff',
                                      borderColor: '#1976d2'
                                    }
                                  }}
                                >
                                  Upload Medical Reports
                                  <VisuallyHiddenInput 
                                    type="file"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files);
                                      files.forEach(file => {
                                        setUploadedFiles(prev => [...prev, { type: 'Medical Report', file }]);
                                      });
                                    }}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    multiple
                                  />
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Display Uploaded Files */}
                          {uploadedFiles.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                                Uploaded Documents
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {uploadedFiles.map((file, index) => (
                                  <Chip
                                    key={index}
                                    label={`${file.type}: ${file.file.name}`}
                                    onDelete={() => removeFile(index)}
                                    sx={{
                                      backgroundColor: '#e3f2fd',
                                      color: '#1976d2',
                                      '& .MuiChip-deleteIcon': {
                                        color: '#1976d2',
                                        '&:hover': {
                                          color: '#d32f2f'
                                        }
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </>
                  )}

                  {/* Step 2: Commission Details */}
                  {activeStep === 1 && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                          Commission Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Commission Amount"
                          value={newPolicy.commissionAmount}
                          onChange={handleNewPolicyChange('commissionAmount')}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                          error={!!errors.commissionAmount}
                          helperText={errors.commissionAmount}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Commission Percentage"
                          value={newPolicy.commissionPercentage}
                          onChange={handleNewPolicyChange('commissionPercentage')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          error={!!errors.commissionPercentage}
                          helperText={errors.commissionPercentage}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              {/* Travel Insurance Form */}
              {insuranceType === 'travel' && (
                <>
                  {/* Step 1: Travel Insurance Details */}
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                          Travel Insurance Details
                        </Typography>
                        <Divider />
                      </Grid>

                      {/* Basic Policy Details */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: '#ffffff' }}>
                          Basic Policy Details
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Policy Number"
                          value={newPolicy.policyNumber}
                          onChange={handleNewPolicyChange('policyNumber')}
                          error={!!errors.policyNumber}
                          helperText={errors.policyNumber}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required error={!!errors.company}>
                          <InputLabel sx={{ color: '#ffffff' }}>Insurance Company</InputLabel>
                          <Select
                            value={newPolicy.company}
                            onChange={handleNewPolicyChange('company')}
                            label="Insurance Company"
                            sx={{ color: '#ffffff' }}
                          >
                            {insuranceCompanies.map((company) => (
                              <MenuItem key={company} value={company}>{company}</MenuItem>
                            ))}
                          </Select>
                          {errors.company && (
                            <FormHelperText error>{errors.company}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required error={!!errors.travelType}>
                          <InputLabel sx={{ color: '#ffffff' }}>Travel Type</InputLabel>
                          <Select
                            value={newPolicy.travelType}
                            onChange={handleNewPolicyChange('travelType')}
                            label="Travel Type"
                            sx={{ color: '#ffffff' }}
                          >
                            {travelTypes.map((type) => (
                              <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                          </Select>
                          {errors.travelType && (
                            <FormHelperText error>{errors.travelType}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Destination"
                          value={newPolicy.destination}
                          onChange={handleNewPolicyChange('destination')}
                          error={!!errors.destination}
                          helperText={errors.destination}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Trip Duration (Days)"
                          type="number"
                          value={newPolicy.tripDuration}
                          onChange={handleNewPolicyChange('tripDuration')}
                          error={!!errors.tripDuration}
                          helperText={errors.tripDuration}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Start Date"
                          type="date"
                          value={newPolicy.startDate || ''}
                          onChange={handleNewPolicyChange('startDate')}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.startDate}
                          helperText={errors.startDate}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="End Date"
                          type="date"
                          value={newPolicy.endDate || ''}
                          onChange={handleNewPolicyChange('endDate')}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.endDate}
                          helperText={errors.endDate}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Step 2: Commission Details */}
                  {activeStep === 1 && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                          Commission Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Commission Amount"
                          value={newPolicy.commissionAmount}
                          onChange={handleNewPolicyChange('commissionAmount')}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                          error={!!errors.commissionAmount}
                          helperText={errors.commissionAmount}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Commission Percentage"
                          value={newPolicy.commissionPercentage}
                          onChange={handleNewPolicyChange('commissionPercentage')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          error={!!errors.commissionPercentage}
                          helperText={errors.commissionPercentage}
                          sx={{ 
                            '& .MuiInputLabel-root': { color: '#ffffff' },
                            '& .MuiOutlinedInput-root': { color: '#ffffff' }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>

            {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={activeStep === 0 ? () => {
                  setOpenNewPolicy(false);
                  resetForm();
                  handleReset();
                } : handleBack}
                sx={{ textTransform: 'none', color: '#ffffff' }}
                disabled={isSubmitting}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps[insuranceType].length - 1 ? handleAddPolicy : handleNext}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "#ffffff",
                  textTransform: 'none',
                  color: '#0C47A0',
                  '&:hover': {
                    backgroundColor: "#e0e0e0"
                  }
                }}
              >
                {activeStep === steps[insuranceType].length - 1 ? 
                  (isSubmitting ? 'Creating Policy...' : 'Create Policy') : 
                  'Next'}
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
                error={!!errors.policyNumber}
                helperText={errors.policyNumber}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Insured Name"
                value={newPolicy.insuredName}
                onChange={(e) => setNewPolicy({ ...newPolicy, insuredName: e.target.value })}
                error={!!errors.insuredName}
                helperText={errors.insuredName}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Client Name"
                value={newPolicy.clientName}
                onChange={(e) => setNewPolicy({ ...newPolicy, clientName: e.target.value })}
                error={!!errors.clientName}
                helperText={errors.clientName}
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
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth error={!!errors.company}>
                <InputLabel sx={{ color: '#ffffff' }}>Insurance Company</InputLabel>
                <Select
                  value={newPolicy.company}
                  onChange={(e) => setNewPolicy({ ...newPolicy, company: e.target.value })}
                  label="Insurance Company"
                  sx={{ color: '#ffffff' }}
                >
                  {insuranceCompanies.map((company) => (
                    <MenuItem key={company} value={company}>{company}</MenuItem>
                  ))}
                </Select>
                {errors.company && <Typography color="error" variant="caption" sx={{ color: '#ffffff' }}>{errors.company}</Typography>}
              </FormControl>
              <FormControl fullWidth error={!!errors.business}>
                <InputLabel sx={{ color: '#ffffff' }}>Business Type</InputLabel>
                <Select
                  value={newPolicy.business}
                  onChange={(e) => setNewPolicy({ ...newPolicy, business: e.target.value })}
                  label="Business Type"
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="New">New Policy</MenuItem>
                  <MenuItem value="Renewal">Policy Renewal</MenuItem>
                </Select>
                {errors.business && <Typography color="error" variant="caption" sx={{ color: '#ffffff' }}>{errors.business}</Typography>}
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