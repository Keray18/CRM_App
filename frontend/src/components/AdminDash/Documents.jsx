import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Snackbar,
  Alert,
  Autocomplete,
  Paper,
  Divider,
  Stack,
  Modal,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Upload as UploadIcon,
  Description as DocumentIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config/config';

const Documents = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'PDF',
    file: null
  });

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_URL}/leads`);
        setLeads(response.data.leads || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setSnackbar({
          open: true,
          message: 'Error fetching leads',
          severity: 'error'
        });
      }
    };
    fetchLeads();
  }, []);

  // Fetch documents when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [selectedLead]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/documents/lead/${selectedLead}`);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching documents',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadForm(prev => ({
        ...prev,
        file,
        name: file.name
      }));
    } else {
      setSnackbar({
        open: true,
        message: 'Only PDF files are allowed',
        severity: 'error'
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a file',
        severity: 'error' 
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', uploadForm.file);
    formData.append('name', uploadForm.name);
    formData.append('type', uploadForm.type);

    try {
      await axios.post(`${API_URL}/documents/lead/${selectedLead}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbar({ 
        open: true, 
        message: 'Document uploaded successfully', 
        severity: 'success' 
      });
      setOpenUploadDialog(false);
      setUploadForm({
        name: '',
        type: 'PDF',
        file: null
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error uploading document',
        severity: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await axios.get(document.url, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      setSnackbar({
        open: true,
        message: 'Error downloading document',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await axios.delete(`${API_URL}/documents/${documentId}`);
      setSnackbar({ 
        open: true, 
        message: 'Document deleted successfully',
        severity: 'success' 
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error deleting document',
        severity: 'error' 
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }} color="#0C47A0">
        <DocumentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Document Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{
          '& .MuiInputLabel-root': {
            color: '#0C47A0',
            fontWeight: 'bold',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#0C47A0',
            },
            '&:hover fieldset': {
              borderColor: '#1565c0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0C47A0',
            },
            backgroundColor: 'white',
            color: '#0C47A0',
          },
          '& .MuiSelect-icon': {
            color: '#0C47A0',
          },
        }}>
          <InputLabel>Select Lead</InputLabel>
          <Select
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            label="Select Lead"
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#0C47A0',
                  color: 'white',
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&.Mui-selected': {
                      backgroundColor: '#1565c0',
                    },
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  },
                },
              },
            }}
          >
            {leads.map((lead) => (
              <MenuItem key={lead.id} value={lead.id}>
                {lead.leadName} - {lead.leadPhone}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedLead && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenUploadDialog(true)}
              >
              Upload Document
              </Button>
            </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Document Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white' }}>Uploaded At</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                          <IconButton 
                            color="primary" 
                          onClick={() => handleDownload(doc)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                        >
                            <DeleteIcon />
                          </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
              label="Document Name"
              value={uploadForm.name}
              onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={uploadForm.type}
                onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                label="Document Type"
              >
                <MenuItem value="PDF">PDF</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Choose PDF File
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>
            {uploadForm.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {uploadForm.file.name}
              </Typography>
            )}
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpload}
            variant="contained" 
            disabled={uploading || !uploadForm.file}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Documents;
