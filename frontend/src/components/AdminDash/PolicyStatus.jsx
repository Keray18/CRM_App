import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
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
  FormHelperText,
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
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  Info as InfoIcon,
  Description,
  Autorenew as RenewIcon, // Change 'Renew' to 'Autorenew'
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  getAllPolicies,
  getPolicyStats,
  getLeadsForPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  updatePolicyStatus
} from '../../services/policyService';
// import axios from 'axios'; // Already imported above
import { API_URL } from '../../config/config';

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

const PolicyStatus = ({ addCustomer }) => { // Removed leads prop
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
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [localLeads, setLocalLeads] = useState([]);
  const [allLeadsForSearch, setAllLeadsForSearch] = useState([]); // State to hold all leads for search

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
    type: 'vehicle', // Ensure this matches insuranceType state
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
    netPremium: '',
  });

  // Add useEffect to update policy type when insurance type changes
  useEffect(() => {
    setNewPolicy(prev => ({
      ...prev,
      type: insuranceType
    }));
  }, [insuranceType]);

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
      },
      {
        id: 'P2',
        policyNumber: '212',
        insuredName: 'ANmol',
        startDate: '2024-03-01',
        endDate: '2027-06-08',
        company: 'ICICI Lombard GIC',
        business: 'New',
        type: 'vehicle',
        status: 'Live Policy',
      }
    ];
    setPolicies(initialPolicies);
  }, []);

  // Fetch policies on component mount and leads when modal opens
  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        // Use the provided API endpoint
        const response = await axios.get(`http://localhost:8080/api/leads`);
        if (response.data && Array.isArray(response.data.leads)) {
          setAllLeadsForSearch(response.data.leads);
        } else {
           setAllLeadsForSearch([]); // Ensure it's an empty array if data is not as expected
           console.error("Fetched leads data is not an array:", response.data);
        }
      } catch (error) {
        console.error('Error fetching all leads:', error);
        setSnackbar({
          open: true,
          message: 'Error fetching leads for search',
          severity: 'error',
        });
         setAllLeadsForSearch([]); // Reset on error
      }
    };

    // Fetch leads when the new policy modal is opened
    if (openNewPolicy) {
        fetchAllLeads();
    }
    // Fetch policies and stats (existing logic)
    fetchPolicies();
    fetchStats(); // Renamed from fetchPolicyStats if that was intended

  }, [openNewPolicy, currentTab, searchTerm, currentMonth]); // Add openNewPolicy dependency

  // Fetch policies with filters
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const filters = {
        status: currentTab !== 'all' ? currentTab : undefined,
        search: searchTerm,
        month: currentMonth !== 'All' ? currentMonth : undefined
      };
      const data = await getAllPolicies(filters);
      setPolicies(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error fetching policies',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch policy statistics
  const fetchStats = async () => {
    try {
      const data = await getPolicyStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update lead search handler
  const handleLeadSearch = (event) => {
    const term = event.target.value;
    setLeadSearchTerm(term);
    if (term) {
      const lowerCaseTerm = term.toLowerCase();
      // Filter from the locally stored allLeadsForSearch
      const results = allLeadsForSearch.filter(lead =>
        (lead.leadName && lead.leadName.toLowerCase().includes(lowerCaseTerm)) ||
        (lead.leadEmail && lead.leadEmail.toLowerCase().includes(lowerCaseTerm)) ||
        (lead.leadPhone && lead.leadPhone.includes(term)) // Phone might not need lowercasing
      );
      setFilteredLeads(results);
    } else {
      setFilteredLeads([]); // Clear results if search term is empty
    }
  };

  // Add fetchLeads function
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      setLocalLeads(response.data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setSnackbar({
        open: true,
        message: "Error fetching leads",
        severity: "error"
      });
    }
  };

  // Add useEffect to fetch leads when component mounts
  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead selection handler
  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setNewPolicy(prev => ({
      ...prev,
      insuredName: lead.leadName || '', // Use leadName from the lead object
      mobile: lead.leadPhone || '',    // Use leadPhone
      email: lead.leadEmail || '',      // Use leadEmail
      // Reset other fields if needed or pre-fill based on lead type
      type: lead.leadPolicyType || insuranceType, // Pre-fill type if available
    }));
    setLeadSearchTerm(''); // Clear search term
    setFilteredLeads([]); // Clear search results
  };

  // First, update the handleTabChange function to be more explicit
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSearchTerm(''); // Reset search when changing tabs
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
    setNewPolicy(prev => {
      const updated = { ...prev, [field]: value };

      // Calculate premiums when relevant fields change
      if (field === 'basicPremium' || field === 'ncbDiscount' || field === 'tpPremium' || field === 'addonPremium') {
        const basicPremium = parseFloat(updated.basicPremium || 0);
        const ncbDiscount = parseFloat(updated.ncbDiscount || 0);
        const tpPremium = parseFloat(updated.tpPremium || 0);
        const addonPremium = parseFloat(updated.addonPremium || 0);

        // Calculate net premium
        const ncbAmount = (basicPremium * ncbDiscount) / 100;
        const netPremium = basicPremium - ncbAmount + tpPremium + addonPremium;

        // Calculate total premium with 18% GST
        const gstAmount = netPremium * 0.18;
        const totalPremium = netPremium + gstAmount;

        return {
          ...updated,
          netPremium: netPremium.toFixed(2),
          gst: gstAmount.toFixed(2),
          totalPremium: totalPremium.toFixed(2)
        };
      }

      return updated;
    });
  };

  const calculateCommission = (policy) => {
    if (!policy || !policy.commissionType) return null;

    try {
      let totalCommission = 0;
      let effectivePercentage = 0;

      const odPremium = parseFloat(policy.odPremium || 0);
      const tpPremium = parseFloat(policy.tpPremium || 0);
      const addonPremium = parseFloat(policy.addonPremium || 0);
      const odCommissionPercentage = parseFloat(policy.odCommissionPercentage || 0);
      const tpCommissionPercentage = parseFloat(policy.tpCommissionPercentage || 0);
      const addonCommissionPercentage = parseFloat(policy.addonCommissionPercentage || 0);

      if (policy.commissionType === 'OD') {
        totalCommission = (odPremium * odCommissionPercentage) / 100;
        effectivePercentage = odCommissionPercentage;
      } else if (policy.commissionType === 'TP_OD_ADDON') {
        const totalPremium = odPremium + tpPremium + addonPremium;
        const commissionPercentage = parseFloat(policy.commissionPercentage || 0);
        totalCommission = (totalPremium * commissionPercentage) / 100;
        effectivePercentage = commissionPercentage;
      } else if (policy.commissionType === 'BOTH') {
        const odAmount = (odPremium * odCommissionPercentage) / 100;
        const tpAmount = (tpPremium * tpCommissionPercentage) / 100;
        totalCommission = odAmount + tpAmount;
        const totalBaseAmount = odPremium + tpPremium;
        effectivePercentage = totalBaseAmount > 0 ? (totalCommission / totalBaseAmount) * 100 : 0;
      }

      return {
        commissionAmount: totalCommission.toFixed(2),
        commissionPercentage: effectivePercentage.toFixed(2),
        totalCommissionAmount: totalCommission.toFixed(2),
        effectiveCommissionPercentage: effectivePercentage.toFixed(2)
      };
    } catch (error) {
      console.error('Error calculating commission:', error);
      return null;
    }
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

    // Document validation for vehicle insurance
    if (insuranceType === 'vehicle' && uploadedFiles.length === 0) {
      newErrors.documents = 'At least one document is required';
      setSnackbar({
        open: true,
        message: 'Please upload required documents',
        severity: 'error'
      });
    }

    console.log('Validation Errors:', newErrors); // Debug log
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add policy
  const handleAddPolicy = async () => {
    try {
      // Validate the form first
      if (!validateForm()) {
        return;
      }

      setLoading(true);
      const policyToAdd = {
        ...newPolicy,
        type: insuranceType,
        status: 'Live Policy',
        documents: uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          uploadDate: new Date()
        })),
        sumInsured: newPolicy.sumInsured ? Number(newPolicy.sumInsured) : null,
        tripDuration: newPolicy.tripDuration ? Number(newPolicy.tripDuration) : null,
        height: newPolicy.height ? Number(newPolicy.height) : null,
        weight: newPolicy.weight ? Number(newPolicy.weight) : null,
        year: newPolicy.year ? Number(newPolicy.year) : null,
        basicPremium: newPolicy.basicPremium ? Number(newPolicy.basicPremium) : null,
        odPremium: newPolicy.odPremium ? Number(newPolicy.odPremium) : null,
        tpPremium: newPolicy.tpPremium ? Number(newPolicy.tpPremium) : null,
        ncbDiscount: newPolicy.ncbDiscount ? Number(newPolicy.ncbDiscount) : null,
        addonPremium: newPolicy.addonPremium ? Number(newPolicy.addonPremium) : null,
        gst: newPolicy.gst ? Number(newPolicy.gst) : null,
        totalPremium: newPolicy.totalPremium ? Number(newPolicy.totalPremium) : null,
        netPremium: newPolicy.netPremium ? Number(newPolicy.netPremium) : null,
        odCommissionPercentage: newPolicy.odCommissionPercentage ? Number(newPolicy.odCommissionPercentage) : null,
        tpCommissionPercentage: newPolicy.tpCommissionPercentage ? Number(newPolicy.tpCommissionPercentage) : null,
        addonCommissionPercentage: newPolicy.addonCommissionPercentage ? Number(newPolicy.addonCommissionPercentage) : null,
        commissionAmount: newPolicy.commissionAmount ? Number(newPolicy.commissionAmount) : null,
        totalCommissionAmount: newPolicy.totalCommissionAmount ? Number(newPolicy.totalCommissionAmount) : null,
        effectiveCommissionPercentage: newPolicy.effectiveCommissionPercentage ? Number(newPolicy.effectiveCommissionPercentage) : null,
        age: newPolicy.age ? Number(newPolicy.age) : null,
      };

      const createdPolicy = await createPolicy(policyToAdd);
      setPolicies(prevPolicies => [...prevPolicies, createdPolicy]);
      // Add to customers if addCustomer is provided
      if (addCustomer) {
        addCustomer({
          id: createdPolicy.id,
          name: createdPolicy.insuredName,
          phone: createdPolicy.mobile,
          email: createdPolicy.email,
          policy: createdPolicy.type,
          conversionDate: createdPolicy.startDate || new Date().toISOString(),
        });
      }
      resetForm();
      setOpenNewPolicy(false);
      setSnackbar({
        open: true,
        message: 'Policy added successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error adding policy',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
      policyNumber: '',
      insuredName: '',
      mobile: '',
      email: '',
      startDate: todayStr,
      endDate: nextYearStr,
      company: '',
      business: 'New',
      type: insuranceType, // Set type to current insuranceType
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

  // Handle status change
  const handleStatusChange = async (policyId, newStatus) => {
    try {
      const updatedPolicy = await updatePolicyStatus(policyId, String(newStatus));
      const policyObj = Array.isArray(updatedPolicy) ? updatedPolicy[0] : updatedPolicy;
      setPolicies(prevPolicies =>
        prevPolicies.map(policy =>
          policy.id === policyObj.id ? policyObj : policy
        )
      );
      setSnackbar({
        open: true,
        message: `Policy status updated to ${newStatus}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error updating policy status',
        severity: 'error'
      });
    }
  };

  // Update the filteredPolicies logic to properly filter based on status
  const getFilteredPolicies = () => {
    return policies.filter(policy => {
      // First filter by tab/status
      if (currentTab !== 'all') {
        const statusMap = {
          'active': 'Live Policy',
          'lapsed': 'Lapsed',
          'pending': 'Pending'
        };
        const requiredStatus = statusMap[currentTab];
        if (policy.status !== requiredStatus) {
          return false;
        }
      }

      // Then filter by search term if it exists
      if (searchTerm.trim()) {
        const searchFields = [
          policy.policyNumber,
          policy.insuredName,
          policy.company,
          policy.business,
          policy.status
        ];
        
        return searchFields.some(field => 
          field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return true;
    });
  };

  // Replace the existing filteredPolicies variable with the new function call
  const filteredPolicies = getFilteredPolicies();

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
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deletePolicy(selectedPolicy.id);
      
      setPolicies(prevPolicies => prevPolicies.filter(p => p.id !== selectedPolicy.id));
      setDeleteDialogOpen(false);
      setSelectedPolicy(null);
      
      setSnackbar({
        open: true,
        message: 'Policy deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error deleting policy',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Update Policy
  const handleUpdatePolicy = async () => {
    try {
      setLoading(true);
      const updatedPolicy = await updatePolicy(selectedPolicy.id, {
        ...newPolicy,
        sumInsured: newPolicy.sumInsured ? Number(newPolicy.sumInsured) : null,
        tripDuration: newPolicy.tripDuration ? Number(newPolicy.tripDuration) : null,
        height: newPolicy.height ? Number(newPolicy.height) : null,
        weight: newPolicy.weight ? Number(newPolicy.weight) : null,
        year: newPolicy.year ? Number(newPolicy.year) : null,
        basicPremium: newPolicy.basicPremium ? Number(newPolicy.basicPremium) : null,
        odPremium: newPolicy.odPremium ? Number(newPolicy.odPremium) : null,
        tpPremium: newPolicy.tpPremium ? Number(newPolicy.tpPremium) : null,
        ncbDiscount: newPolicy.ncbDiscount ? Number(newPolicy.ncbDiscount) : null,
        addonPremium: newPolicy.addonPremium ? Number(newPolicy.addonPremium) : null,
        gst: newPolicy.gst ? Number(newPolicy.gst) : null,
        totalPremium: newPolicy.totalPremium ? Number(newPolicy.totalPremium) : null,
        netPremium: newPolicy.netPremium ? Number(newPolicy.netPremium) : null,
        odCommissionPercentage: newPolicy.odCommissionPercentage ? Number(newPolicy.odCommissionPercentage) : null,
        tpCommissionPercentage: newPolicy.tpCommissionPercentage ? Number(newPolicy.tpCommissionPercentage) : null,
        addonCommissionPercentage: newPolicy.addonCommissionPercentage ? Number(newPolicy.addonCommissionPercentage) : null,
        commissionAmount: newPolicy.commissionAmount ? Number(newPolicy.commissionAmount) : null,
        totalCommissionAmount: newPolicy.totalCommissionAmount ? Number(newPolicy.totalCommissionAmount) : null,
        effectiveCommissionPercentage: newPolicy.effectiveCommissionPercentage ? Number(newPolicy.effectiveCommissionPercentage) : null,
        age: newPolicy.age ? Number(newPolicy.age) : null,
      });
      setPolicies(prevPolicies =>
        prevPolicies.map(policy =>
          policy.id === selectedPolicy.id ? updatedPolicy : policy
        )
      );
      setSnackbar({
        open: true,
        message: 'Policy updated successfully',
        severity: 'success'
      });
      setEditModalOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error updating policy',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add cleanup for modal closes
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPolicy(null);
  };

  const handleRenew = (policy) => {
    // Implement renewal logic here
    console.log('Renewing policy:', policy);
    // You can add your renewal logic here
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
          <Tab 
            label={`All Policies (${policies.length})`} 
            value="all" 
          />
          <Tab 
            label={`Active (${policies.filter(p => p.status === 'Live Policy').length})`}
            value="active" 
          />
          <Tab 
            label={`Lapsed (${policies.filter(p => p.status === 'Lapsed').length})`}
            value="lapsed" 
          />
          <Tab 
            label={`Pending (${policies.filter(p => p.status === 'Pending').length})`}
            value="pending" 
          />
        </Tabs>
      </Box>
      <Typography>
        abshdbaj
      </Typography>

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
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={policy.status}
                      onChange={(e) => handleStatusChange(policy.id, e.target.value)}
                      sx={{
                        height: '32px',
                        '& .MuiSelect-select': {
                          padding: '4px 8px',
                          paddingRight: '24px !important',
                        },
                        backgroundColor: (() => {
                          switch (policy.status) {
                            case 'Live Policy': return '#e8f5e9';
                            case 'Lapsed': return '#ffebee';
                            case 'Pending': return '#fff3e0';
                            default: return '#ffffff';
                          }
                        })(),
                        color: (() => {
                          switch (policy.status) {
                            case 'Live Policy': return '#2e7d32';
                            case 'Lapsed': return '#c62828';
                            case 'Pending': return '#ef6c00';
                            default: return '#000000';
                          }
                        })(),
                        '&:hover': {
                          backgroundColor: (() => {
                            switch (policy.status) {
                              case 'Live Policy': return '#c8e6c9';
                              case 'Lapsed': return '#ffcdd2';
                              case 'Pending': return '#ffe0b2';
                              default: return '#f5f5f5';
                            }
                          })()
                        }
                      }}
                    >
                      <MenuItem value="Live Policy" sx={{ color: '#2e7d32' }}>Live Policy</MenuItem>
                      <MenuItem value="Lapsed" sx={{ color: '#c62828' }}>Lapsed</MenuItem>
                      <MenuItem value="Pending" sx={{ color: '#ef6c00' }}>Pending</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Policy">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(policy)}
                      sx={{ 
                        color: '#0C47A0',
                        '&:hover': {
                          backgroundColor: 'rgba(12, 71, 160, 0.04)',
                        },
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Policy">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(policy)}
                      sx={{ 
                        color: '#0C47A0',
                        '&:hover': {
                          backgroundColor: 'rgba(12, 71, 160, 0.04)',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {policy.status === 'Lapsed' && (
                    <Tooltip title="Renew Policy">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleRenew(policy)}
                      >
                        <RenewIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Policy">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(policy)}
                      sx={{ 
                        color: '#D32F2F',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.04)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
          width: '95%', // Adjusted width
          maxWidth: '1200px', // Adjusted maxWidth
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          overflow: 'auto',
          // p: 3 // Padding moved to inner boxes
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
              setSelectedLead(null); // Ensure selectedLead is reset
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
                placeholder="Search by name, email, or phone..."
                value={leadSearchTerm}
                onChange={handleLeadSearch} // Use updated handler
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
              {/* Display Search Results */}
              {leadSearchTerm && (
                 <Paper sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
                   <List dense>
                     {filteredLeads.length > 0 ? (
                       filteredLeads.map((lead) => (
                         <ListItem
                           key={lead._id || lead.id} // Use a unique key like lead.id or _id
                           button
                           onClick={() => handleLeadSelect(lead)} // Use updated handler
                         >
                           <ListItemIcon>
                             <PersonIcon />
                           </ListItemIcon>
                           {/* Display actual lead data */}
                           <ListItemText
                             primary={lead.leadName || 'N/A'} // Show name
                             secondary={
                               <>
                                 <Typography component="span" variant="body2" color="text.primary">
                                   {lead.leadEmail || 'No Email'}
                                 </Typography>
                                 {` — ${lead.leadPhone || 'No Phone'}`}
                               </>
                             }
                           />
                         </ListItem>
                       ))
                     ) : (
                       <ListItem>
                         <ListItemText primary="No leads found" />
                       </ListItem>
                     )}
                   </List>
                 </Paper>
              )}
              {/* Display Selected Lead Info */}
              {selectedLead && (
                <Card variant="outlined" sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', border: '1px solid #ccc', color: '#1976d2' }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Selected Lead:</Typography>
                   <Typography variant="body2">Name: {selectedLead.leadName || 'N/A'}</Typography>
                   <Typography variant="body2">Email: {selectedLead.leadEmail || 'N/A'}</Typography>
                   <Typography variant="body2">Phone: {selectedLead.leadPhone || 'N/A'}</Typography>
                </Card>
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

            {/* Vehicle Insurance Form */}
            {insuranceType === 'vehicle' && (
              <Box>
                {/* Section 1: Vehicle & Customer Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    1. Vehicle & Customer Details
                  </Typography>

                  {/* Document Upload Section */}
                  <Box sx={{ 
                    p: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#ffffff',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Required documents:</Typography>
                            <Box component="ul" sx={{ m: 0, pl: 2 }}>
                              <li key="rc">Registration Certificate (RC)</li>
                              <li key="prev-policy">Previous Insurance Policy</li>
                              <li key="photos">Vehicle Photos</li>
                              <li key="invoice">Invoice (new vehicles)</li>
                              <li key="license">Driving License</li>
                              <li key="id-proof">ID & Address Proof</li>
                            </Box>
                          </Box>
                        }
                        arrow
                      >
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            color: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'help'
                          }}
                        >
                          <InfoIcon sx={{ fontSize: 16 }} />
                          Required Documents
                        </Typography>
                      </Tooltip>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        flex: 1
                      }}>
                        <Button
                          component="label"
                          variant="outlined"
                          size="small"
                          startIcon={<UploadIcon />}
                          sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            backgroundColor: '#ffffff',
                            '&:hover': {
                              backgroundColor: '#f5f9ff',
                              borderColor: '#1976d2'
                            }
                          }}
                        >
                          Upload Files
                          <VisuallyHiddenInput 
                            type="file"
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              const maxSize = 5 * 1024 * 1024; // 5MB
                              const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                              
                              // Validate each file
                              const validFiles = files.filter(file => {
                                if (file.size > maxSize) {
                                  setSnackbar({
                                    open: true,
                                    message: `${file.name} is too large. Maximum size is 5MB`,
                                    severity: 'error'
                                  });
                                  return false;
                                }
                                if (!allowedTypes.includes(file.type)) {
                                  setSnackbar({
                                    open: true,
                                    message: `${file.name} has invalid format. Allowed formats: JPG, PNG, PDF`,
                                    severity: 'error'
                                  });

                                  return false;
                                }
                                return true;
                              });

                              // Add valid files
                              validFiles.forEach(file => {
                                setUploadedFiles(prev => {
                                  // Check for duplicate files
                                  if (prev.some(f => f.file.name === file.name)) {
                                    setSnackbar({
                                      open: true,
                                      message: `${file.name} has already been uploaded`,
                                      severity: 'warning'
                                    });
                                    return prev;
                                  }
                                  return [...prev, { 
                                    type: 'Vehicle Document', 
                                    file,
                                    uploadDate: new Date().toLocaleString()
                                  }];
                                });
                              });

                              // Clear input
                              e.target.value = '';
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                          />
                        </Button>

                        {/* Display Uploaded Files */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 0.5,
                          flex: 1,
                          overflowX: 'auto',
                          '&::-webkit-scrollbar': {
                            height: '4px'
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1'
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '2px'
                          }
                        }}>
                          {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file, index) => (
                              <Chip
                                key={`${file.file.name}-${index}`}
                                label={file.file.name}
                                onDelete={() => removeFile(index)}
                                size="small"
                                sx={{
                                  maxWidth: '200px',
                                  fontSize: '0.75rem',
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  '& .MuiChip-deleteIcon': {
                                    fontSize: '1rem',
                                    color: '#1976d2',
                                    '&:hover': {
                                      color: '#d32f2f'
                                    }
                                  }
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="caption" sx={{ color: '#666666' }}>
                              No files uploaded
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {errors.documents && (
                      <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                        {errors.documents}
                      </Typography>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    {/* Basic Information Fields */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Policy Number"
                        value={newPolicy.policyNumber}
                        onChange={handleNewPolicyChange('policyNumber')}
                        error={!!errors.policyNumber}
                        helperText={errors.policyNumber}
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
                        {errors.business && <FormHelperText error>{errors.business}</FormHelperText>}
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
                        InputLabelProps={{ shrink: true }}
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
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>

                    {/* Customer Details */}
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
                        {errors.company && <FormHelperText error>{errors.company}</FormHelperText>}
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
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.vehicleType}>
                        <InputLabel sx={{ color: '#ffffff' }}>Vehicle Type</InputLabel>
                        <Select
                          value={newPolicy.vehicleType}
                          onChange={handleNewPolicyChange('vehicleType')}
                          label="Vehicle Type"
                          sx={{ color: '#ffffff',width: '200px' }}
                        >
                          {vehicleTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                        {errors.vehicleType && <FormHelperText error>{errors.vehicleType}</FormHelperText>}
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
                  </Grid>
                </Box>

                {/* Section 2: Premium Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    2. Premium Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Basic Premium"
                        value={newPolicy.basicPremium}
                        onChange={handleNewPolicyChange('basicPremium')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.basicPremium}
                        helperText={errors.basicPremium}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.commissionType}>
                        <InputLabel sx={{ color: '#ffffff' }}>Commission Type</InputLabel>
                        <Select
                          value={newPolicy.commissionType || ''}
                          onChange={handleNewPolicyChange('commissionType')}
                          label="Commission Type"
                          sx={{ color: '#ffffff' }}
                        >
                          <MenuItem value="OD">Own Damage Only</MenuItem>
                          <MenuItem value="TP_OD_ADDON">TP + OD + Add-on</MenuItem>
                          <MenuItem value="BOTH">Both (TP + OD%)</MenuItem>
                        </Select>
                        {errors.commissionType && <FormHelperText error>{errors.commissionType}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="OD Premium"
                        value={newPolicy.odPremium}
                        onChange={handleNewPolicyChange('odPremium')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.odPremium}
                        helperText={errors.odPremium}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="TP Premium"
                        value={newPolicy.tpPremium}
                        onChange={handleNewPolicyChange('tpPremium')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.tpPremium}
                        helperText={errors.tpPremium}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="NCB Discount (%)"
                        value={newPolicy.ncbDiscount}
                        onChange={handleNewPolicyChange('ncbDiscount')}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 50 }
                        }}
                        error={!!errors.ncbDiscount}
                        helperText={errors.ncbDiscount}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Add-on Premium"
                        value={newPolicy.addonPremium}
                        onChange={handleNewPolicyChange('addonPremium')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.addonPremium}
                        helperText={errors.addonPremium}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Net Premium"
                        value={newPolicy.netPremium || '0.00'}
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
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.paymentMode}>
                        <InputLabel sx={{ color: '#ffffff' }}>Payment Mode</InputLabel>
                        <Select
                          value={newPolicy.paymentMode}
                          onChange={handleNewPolicyChange('paymentMode')}
                          label="Payment Mode"
                          sx={{ color: '#ffffff',width: '200px' }}
                        >
                          <MenuItem value="Cash">Cash</MenuItem>
                          <MenuItem value="Cheque">Cheque</MenuItem>
                          <MenuItem value="Online Transfer">Online Transfer</MenuItem>
                          <MenuItem value="UPI">UPI</MenuItem>
                        </Select>
                        {errors.paymentMode && <FormHelperText error>{errors.paymentMode}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                  </Grid>
                </Box>

                {/* Section 3: Commission Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    3. Commission Details
                  </Typography>
                  <Grid container spacing={3}>
                    {/* OD Premium Commission */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="OD Premium Amount"
                        value={newPolicy.odPremium || '0'}
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
                        label="OD Commission Percentage"
                        value={newPolicy.odCommissionPercentage || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleNewPolicyChange('odCommissionPercentage')({ target: { value } });
                          
                          // Calculate OD Commission
                          const odPremium = parseFloat(newPolicy.odPremium) || 0;
                          const odCommission = odPremium * (parseFloat(value) || 0) / 100;
                          
                          // Calculate total commission
                          const tpPremium = parseFloat(newPolicy.tpPremium) || 0;
                          const tpCommission = tpPremium * (parseFloat(newPolicy.tpCommissionPercentage) || 0) / 100;
                          
                          const addonPremium = parseFloat(newPolicy.addonPremium) || 0;
                          const addonCommission = addonPremium * (parseFloat(newPolicy.addonCommissionPercentage) || 0) / 100;
                          
                          const totalCommission = odCommission + tpCommission + addonCommission;
                          
                          setNewPolicy(prev => ({
                            ...prev,
                            totalCommissionAmount: totalCommission.toFixed(2)
                          }));
                        }}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100 }
                        }}
                        error={!!errors.odCommissionPercentage}
                        helperText={errors.odCommissionPercentage}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>

                    {/* TP Premium Commission */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="TP Premium Amount"
                        value={newPolicy.tpPremium || '0'}
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
                        label="TP Commission Percentage"
                        value={newPolicy.tpCommissionPercentage || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleNewPolicyChange('tpCommissionPercentage')({ target: { value } });
                          
                          // Calculate TP Commission
                          const tpPremium = parseFloat(newPolicy.tpPremium) || 0;
                          const tpCommission = tpPremium * (parseFloat(value) || 0) / 100;
                          
                          // Calculate total commission
                          const odPremium = parseFloat(newPolicy.odPremium) || 0;
                          const odCommission = odPremium * (parseFloat(newPolicy.odCommissionPercentage) || 0) / 100;
                          
                          const addonPremium = parseFloat(newPolicy.addonPremium) || 0;
                          const addonCommission = addonPremium * (parseFloat(newPolicy.addonCommissionPercentage) || 0) / 100;
                          
                          const totalCommission = odCommission + tpCommission + addonCommission;
                          
                          setNewPolicy(prev => ({
                            ...prev,
                            totalCommissionAmount: totalCommission.toFixed(2)
                          }));
                        }}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100 }
                        }}
                        error={!!errors.tpCommissionPercentage}
                        helperText={errors.tpCommissionPercentage}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>

                    {/* Add-on Premium Commission */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Add-on Premium Amount"
                        value={newPolicy.addonPremium || '0'}
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
                        label="Add-on Commission Percentage"
                        value={newPolicy.addonCommissionPercentage || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleNewPolicyChange('addonCommissionPercentage')({ target: { value } });
                          
                          // Calculate Add-on Commission
                          const addonPremium = parseFloat(newPolicy.addonPremium) || 0;
                          const addonCommission = addonPremium * (parseFloat(value) || 0) / 100;
                          
                          // Calculate total commission
                          const odPremium = parseFloat(newPolicy.odPremium) || 0;
                          const odCommission = odPremium * (parseFloat(newPolicy.odCommissionPercentage) || 0) / 100;
                          
                          const tpPremium = parseFloat(newPolicy.tpPremium) || 0;
                          const tpCommission = tpPremium * (parseFloat(newPolicy.tpCommissionPercentage) || 0) / 100;
                          
                          const totalCommission = odCommission + tpCommission + addonCommission;
                          
                          setNewPolicy(prev => ({
                            ...prev,
                            totalCommissionAmount: totalCommission.toFixed(2)
                          }));
                        }}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100 }
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
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: 'rgba(25, 118, 210, 0.08)', 
                        borderRadius: 1,
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                      }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                          Total Commission Details
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Total Commission Amount"
                              value={newPolicy.totalCommissionAmount || '0.00'}
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
                              label="Effective Commission Rate"
                              value={(() => {
                                const totalPremium = parseFloat(newPolicy.netPremium) || 0;
                                const totalCommission = parseFloat(newPolicy.totalCommissionAmount) || 0;
                                return totalPremium > 0 ? ((totalCommission / totalPremium) * 100).toFixed(2) : '0.00';
                              })()}
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
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {/* Health Insurance Form */}
            {insuranceType === 'health' && (
              <Box>
                {/* Section 1: Health Insurance Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    1. Health Insurance Details
                  </Typography>
                  <Grid container spacing={3}>
                    {/* Basic Information Fields */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Policy Number"
                        value={newPolicy.policyNumber}
                        onChange={handleNewPolicyChange('policyNumber')}
                        error={!!errors.policyNumber}
                        helperText={errors.policyNumber}
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
                        {errors.business && <FormHelperText error>{errors.business}</FormHelperText>}
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
                        InputLabelProps={{ shrink: true }}
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
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>

                    {/* Customer Details */}
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
                        {errors.company && <FormHelperText error>{errors.company}</FormHelperText>}
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

                    {/* Health Specific Fields */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.healthPlan}>
                        <InputLabel sx={{ color: '#ffffff' }}>Health Plan</InputLabel>
                        <Select
                          value={newPolicy.healthPlan || ''}
                          onChange={handleNewPolicyChange('healthPlan')}
                          label="Health Plan"
                          sx={{ color: '#ffffff' }}
                        >
                          {healthPlans.map((plan) => (
                            <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                          ))}
                        </Select>
                        {errors.healthPlan && <FormHelperText error>{errors.healthPlan}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sum Insured"
                        value={newPolicy.sumInsured}
                        onChange={handleNewPolicyChange('sumInsured')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.sumInsured}
                        helperText={errors.sumInsured}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={newPolicy.dateOfBirth || ''}
                        onChange={handleNewPolicyChange('dateOfBirth')}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
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
                        label="Height (cm)"
                        value={newPolicy.height}
                        onChange={handleNewPolicyChange('height')}
                        type="number"
                        error={!!errors.height}
                        helperText={errors.height}
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
                        label="Weight (kg)"
                        value={newPolicy.weight}
                        onChange={handleNewPolicyChange('weight')}
                        type="number"
                        error={!!errors.weight}
                        helperText={errors.weight}
                        required
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.bloodGroup}>
                        <InputLabel sx={{ color: '#ffffff' }}>Blood Group</InputLabel>
                        <Select
                          value={newPolicy.bloodGroup || ''}
                          onChange={handleNewPolicyChange('bloodGroup')}
                          label="Blood Group"
                          sx={{ color: '#ffffff' }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                            <MenuItem key={group} value={group}>{group}</MenuItem>
                          ))}
                        </Select>
                        {errors.bloodGroup && <FormHelperText error>{errors.bloodGroup}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.preExistingConditions}>
                        <FormLabel sx={{ color: '#ffffff' }}>Pre-existing Conditions</FormLabel>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {[
                            'None',
                            'Diabetes',
                            'Hypertension',
                            'Heart Disease',
                            'Asthma',
                            'Thyroid',
                            'Other'
                          ].map((condition) => (
                            <Chip
                              key={condition}
                              label={condition}
                              onClick={() => {
                                const currentConditions = newPolicy.preExistingConditions || [];
                                if (condition === 'None') {
                                  setNewPolicy({ ...newPolicy, preExistingConditions: ['None'] });
                                } else {
                                  const updatedConditions = currentConditions.includes(condition)
                                    ? currentConditions.filter(c => c !== condition)
                                    : [...currentConditions.filter(c => c !== 'None'), condition];
                                  setNewPolicy({ ...newPolicy, preExistingConditions: updatedConditions });
                                }
                              }}
                              color={newPolicy.preExistingConditions?.includes(condition) ? 'primary' : 'default'}
                              sx={{ 
                                backgroundColor: newPolicy.preExistingConditions?.includes(condition) 
                                  ? 'primary.main' 
                                  : 'rgba(255, 255, 255, 0.1)',
                                color: '#ffffff'
                              }}
                            />
                          ))}
                        </Box>
                        {errors.preExistingConditions && (
                          <FormHelperText error>{errors.preExistingConditions}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {/* Section 2: Commission Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    2. Commission Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Commission Percentage"
                        value={newPolicy.commissionPercentage}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleNewPolicyChange('commissionPercentage')({ target: { value } });
                          
                          // Calculate commission amount based on sum insured
                          const sumInsured = parseFloat(newPolicy.sumInsured) || 0;
                          const commissionAmount = sumInsured * (parseFloat(value) || 0) / 100;
                          
                          setNewPolicy(prev => ({
                            ...prev,
                            commissionAmount: commissionAmount.toFixed(2),
                            totalCommissionAmount: commissionAmount.toFixed(2)
                          }));
                        }}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100 }
                        }}
                        error={!!errors.commissionPercentage}
                        helperText={errors.commissionPercentage}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Commission Amount"
                        value={newPolicy.commissionAmount}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          readOnly: true
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {/* Travel Insurance Form */}
            {insuranceType === 'travel' && (
              <Box>
                {/* Section 1: Travel Insurance Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    1. Travel Insurance Details
                  </Typography>
                  <Grid container spacing={3}>
                    {/* Basic Information Fields */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Policy Number"
                        value={newPolicy.policyNumber}
                        onChange={handleNewPolicyChange('policyNumber')}
                        error={!!errors.policyNumber}
                        helperText={errors.policyNumber}
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
                        {errors.business && <FormHelperText error>{errors.business}</FormHelperText>}
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
                        InputLabelProps={{ shrink: true }}
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
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>

                    {/* Customer Details */}
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
                        {errors.company && <FormHelperText error>{errors.company}</FormHelperText>}
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

                    {/* Travel Specific Fields */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.travelType}>
                        <InputLabel sx={{ color: '#ffffff' }}>Travel Type</InputLabel>
                        <Select
                          value={newPolicy.travelType || ''}
                          onChange={handleNewPolicyChange('travelType')}
                          label="Travel Type"
                          sx={{ color: '#ffffff' }}
                        >
                          {travelTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                        {errors.travelType && <FormHelperText error>{errors.travelType}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sum Insured"
                        value={newPolicy.sumInsured}
                        onChange={handleNewPolicyChange('sumInsured')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        error={!!errors.sumInsured}
                        helperText={errors.sumInsured}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Destination"
                        value={newPolicy.destination}
                        onChange={handleNewPolicyChange('destination')}
                        error={!!errors.destination}
                        helperText={errors.destination}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Trip Duration (days)"
                        value={newPolicy.tripDuration}
                        onChange={handleNewPolicyChange('tripDuration')}
                        type="number"
                        error={!!errors.tripDuration}
                        helperText={errors.tripDuration}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Passport Number"
                        value={newPolicy.passportNumber}
                        onChange={handleNewPolicyChange('passportNumber')}
                        error={!!errors.passportNumber}
                        helperText={errors.passportNumber}
                        required
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& .MuiOutlinedInput-root': { color: '#ffffff' }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Section 2: Commission Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 1 }}>
                    2. Commission Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Commission Percentage"
                        value={newPolicy.commissionPercentage}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleNewPolicyChange('commissionPercentage')({ target: { value } });
                          
                          // Calculate commission amount based on sum insured
                          const sumInsured = parseFloat(newPolicy.sumInsured) || 0;
                          const commissionAmount = sumInsured * (parseFloat(value) || 0) / 100;
                          
                          setNewPolicy(prev => ({
                            ...prev,
                            commissionAmount: commissionAmount.toFixed(2),
                            totalCommissionAmount: commissionAmount.toFixed(2)
                          }));
                        }}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          inputProps: { min: 0, max: 100 }
                        }}
                        error={!!errors.commissionPercentage}
                        helperText={errors.commissionPercentage}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Commission Amount"
                        value={newPolicy.commissionAmount}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          readOnly: true
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={() => {
                  setOpenNewPolicy(false);
                  resetForm();
                  handleReset();
                  setSelectedLead(null); // Reset selected lead on cancel
                }}
                sx={{ textTransform: 'none', color: '#ffffff' }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddPolicy}
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
                        <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.mobile || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.email || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.company}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Business Type</Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.business}</Typography>
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
                  </Grid>
                </Grid>

                {/* Vehicle Policy Details */}
                {selectedPolicy.type === 'vehicle' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Vehicle & Premium Details
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
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Make</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.make || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Model</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.model || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Manufacturing Year</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.year || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Basic Premium</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.basicPremium ? `₹${selectedPolicy.basicPremium}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">OD Premium</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.odPremium ? `₹${selectedPolicy.odPremium}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">TP Premium</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.tpPremium ? `₹${selectedPolicy.tpPremium}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">NCB Discount (%)</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.ncbDiscount || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Add-on Premium</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.addonPremium ? `₹${selectedPolicy.addonPremium}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">GST</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.gst ? `₹${selectedPolicy.gst}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Total Premium</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.totalPremium ? `₹${selectedPolicy.totalPremium}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Net Premium</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.netPremium ? `₹${selectedPolicy.netPremium}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Payment Mode</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.paymentMode || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Payment Reference</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.paymentReference || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    {/* Commission Details */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Commission Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Commission Type</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.commissionType || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">OD Commission (%)</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.odCommissionPercentage || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">TP Commission (%)</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.tpCommissionPercentage || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Add-on Commission (%)</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.addonCommissionPercentage || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Commission Amount</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.commissionAmount ? `₹${selectedPolicy.commissionAmount}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Total Commission Amount</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.totalCommissionAmount ? `₹${selectedPolicy.totalCommissionAmount}` : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Effective Commission (%)</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.effectiveCommissionPercentage || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Health Policy Details */}
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
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{Array.isArray(selectedPolicy.preExistingConditions) ? selectedPolicy.preExistingConditions.join(', ') : (selectedPolicy.preExisting || 'N/A')}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    {/* Commission Details */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                      Commission Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Commission Percentage</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.commissionPercentage || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Commission Amount</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.commissionAmount ? `₹${selectedPolicy.commissionAmount}` : 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Travel Policy Details */}
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
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Trip Duration</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {selectedPolicy.tripDuration ? `${selectedPolicy.tripDuration} Days` : 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Sum Insured</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.sumInsured ? `₹${selectedPolicy.sumInsured}` : 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Commission Percentage</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.commissionPercentage || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Commission Amount</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedPolicy.commissionAmount ? `₹${selectedPolicy.commissionAmount}` : 'N/A'}</Typography>
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
                          label={typeof doc === 'string' ? doc : doc.name}
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

      {/* Add loading indicator */}
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
};

export default PolicyStatus;