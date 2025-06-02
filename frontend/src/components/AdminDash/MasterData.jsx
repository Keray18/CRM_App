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
  Tooltip,
  CircularProgress
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
import authHeader from '../../services/authHeader';
import { API_URL } from '../../config/config';
// Configure axios defaults
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';
axios.defaults.headers.common['If-Modified-Since'] = '0';

const types = [
  'Policy Type',
  'Department',
  'Position',
  'Status',
  'Document Type',
  'Commission Type',
  'Insurance Company',
  'Pre-existing Condition'
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
      const timestamp = new Date().getTime();
      const response = await axios.get(`${API_URL}/masterdata/type/${encodeURIComponent(type)}`, {
        headers: {
          ...authHeader(),
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'If-Modified-Since': '0'
        },
        params: {
          _t: timestamp
        }
      });
      console.log('Fetched data:', response.data);
      setMasterData([]);
      setTimeout(() => {
        setMasterData([...response.data]);
        setLoading(false);
      }, 0);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching master data:', error);
      showSnackbar('Error fetching master data', 'error');
    }
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchMasterDataByType(activeTab);
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, [activeTab]);

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
        const response = await axios.put(`${API_URL}/masterdata/${selectedItem.id}`, {
          ...formData,
          type: activeTab
        });
        if (response.data) {
          showSnackbar('Master data updated successfully');
          handleCloseDialog();
          await fetchMasterDataByType(activeTab);
        }
      } else {
        const response = await axios.post(`${API_URL}/masterdata`, {
          ...formData,
          type: activeTab
        });
        if (response.data) {
          showSnackbar('Master data created successfully');
          handleCloseDialog();
          await fetchMasterDataByType(activeTab);
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
        const response = await axios.delete(`${API_URL}/masterdata/${id}`);
        if (response.data) {
          showSnackbar('Master data deleted successfully');
          await fetchMasterDataByType(activeTab);
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
      <TableContainer component={Paper} sx={{ boxShadow: 3, background: '#fff', borderRadius: 2, position: 'relative' }}>
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CircularProgress />
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#0C47A0' }}>
              <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: 16 }}>Name</TableCell>
              <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: 16 }}>Description</TableCell>
              <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: 16 }}>Status</TableCell>
              <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {masterData.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontSize: 15, color: '#111' }}>{item.name}</TableCell>
                <TableCell sx={{ fontSize: 15, color: '#111' }}>{item.description}</TableCell>
                <TableCell>
                  <Typography color={item.isActive ? 'success.main' : 'error.main'} sx={{ fontWeight: 600, fontSize: 15, color: '#111' }}>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#181818',
            color: '#fff',
            borderRadius: 2,
            boxShadow: 24
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#111', color: '#fff' }}>{selectedItem ? 'Edit Master Data' : 'Add Master Data'}</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#181818', color: '#fff' }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            sx={{
              input: { color: '#fff' },
              label: { color: '#aaa' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              }
            }}
            InputLabelProps={{ style: { color: '#aaa' } }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            sx={{
              input: { color: '#fff' },
              label: { color: '#aaa' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              }
            }}
            InputLabelProps={{ style: { color: '#aaa' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#181818' }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 600, fontSize: 16, color: '#fff', backgroundColor: '#333', '&:hover': { backgroundColor: '#222' } }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ fontWeight: 600, fontSize: 16, color: '#fff', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}>
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', backgroundColor: '#222', color: '#fff', border: '1px solid #1976d2' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MasterData;