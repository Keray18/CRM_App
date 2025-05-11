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
import axios from 'axios';

const types = [
  'Policy Type',
  'Department',
  'Position',
  'Status',
  'Document Type',
  'Commission Type',
  'Insurance Company'
];

const MasterData = () => {
  const [activeTab, setActiveTab] = useState(types[0]);
  const [masterData, setMasterData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMasterDataByType(activeTab);
  }, [activeTab]);

  const fetchMasterDataByType = async (type) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/masterdata/type/${encodeURIComponent(type)}`);
      if (response.data) {
        setMasterData(response.data);
      } else {
        setMasterData([]);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching master data', 'error');
      setMasterData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedItem(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
        isActive: item.isActive
      });
    } else {
      setSelectedItem(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      showSnackbar('Name is required', 'error');
      return;
    }
    try {
      if (selectedItem) {
        const response = await axios.put(`http://localhost:8080/api/masterdata/${selectedItem.id}`, {
          ...formData,
          type: activeTab
        });
        if (response.data) {
          showSnackbar('Master data updated successfully');
          handleCloseDialog();
          fetchMasterDataByType(activeTab);
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/masterdata', {
          ...formData,
          type: activeTab
        });
        if (response.data) {
          showSnackbar('Master data created successfully');
          handleCloseDialog();
          fetchMasterDataByType(activeTab);
        }
      }
    } catch (error) {
      console.error('Error saving master data:', error);
      showSnackbar(error.response?.data?.message || 'Error saving master data', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/masterdata/${id}`);
        if (response.data) {
          showSnackbar('Master data deleted successfully');
          fetchMasterDataByType(activeTab);
        }
      } catch (error) {
        console.error('Error deleting master data:', error);
        showSnackbar(error.response?.data?.message || 'Error deleting master data', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3, background: '#f4f6fa', minHeight: '100vh' }}>
      <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#111', fontWeight: 700 }}>
        Master Data Management
      </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3, background: '#fff', borderRadius: 2, boxShadow: 1 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {types.map((type) => (
          <Tab key={type} label={type} value={type} sx={{ fontWeight: 600, fontSize: 16, color: '#111' }} />
        ))}
      </Tabs>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ fontWeight: 600, fontSize: 16, px: 3, py: 1 }}
        >
          Add New
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 3, background: '#fff', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <LinearProgress />
            <Typography sx={{ mt: 2 }}>Loading data...</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#0C47A0' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Description</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {masterData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No data available</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                masterData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ fontSize: 15, color: '#111' }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: 15, color: '#111' }}>{item.description}</TableCell>
                    <TableCell>
                      <Typography color={item.isActive ? 'success.main' : 'error.main'} sx={{ fontWeight: 600, fontSize: 15 }}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#111', fontWeight: 700, fontSize: 22 }}>
          {selectedItem ? `Edit ${activeTab}` : `Add New ${activeTab}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              sx={{ background: '#f9f9f9', borderRadius: 1, color: '#111' }}
              InputLabelProps={{ style: { fontSize: 16, color: '#111' } }}
              inputProps={{ style: { fontSize: 16, color: '#111' } }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ background: '#f9f9f9', borderRadius: 1, color: '#111' }}
              InputLabelProps={{ style: { fontSize: 16, color: '#111' } }}
              inputProps={{ style: { fontSize: 16, color: '#111' } }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: 16, color: '#111' }}>Status</InputLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={handleInputChange}
                label="Status"
                sx={{ fontSize: 16, color: '#111' }}
              >
                <MenuItem value={true} sx={{ color: '#111' }}>Active</MenuItem>
                <MenuItem value={false} sx={{ color: '#111' }}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 600, fontSize: 16, color: '#111' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ fontWeight: 600, fontSize: 16, color: '#111' }}>
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', color: '#111' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MasterData;