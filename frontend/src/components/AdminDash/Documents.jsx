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
  Modal
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
  Close as CloseIcon
} from '@mui/icons-material';

const Documents = ({ 
  customers, 
  documents, 
  setDocuments, 
  documentFiles, 
  setDocumentFiles 
}) => {
  // Customer States
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Local UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categories = ['All', 'Personal Documents', 'Policy Documents', 'Claim Documents', 'Other'];
  const documentTypes = [
    'Aadhar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Voter ID',
    'Policy Document',
    'Claim Form',
    'Medical Report',
    'Other'
  ];

  // Effect to handle customer selection
  useEffect(() => {
    if (selectedCustomer) {
      // Only reset search and filter when customer changes
      setSearchTerm('');
      setFilterCategory('All');
    }
  }, [selectedCustomer]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Store file data
      setDocumentFiles(prev => ({
        ...prev,
        [file.name]: {
          file: file,
          url: fileUrl,
          type: file.type
        }
      }));
      
      setSelectedFile(file);
      setOpenUploadDialog(true);
    }
  };

  const handleUploadConfirm = () => {
    if (!selectedCustomer) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a customer first', 
        severity: 'error' 
      });
      return;
    }

    if (selectedFile && documentType) {
      const newDocument = {
        id: Date.now(),
        customerId: selectedCustomer.id,
        name: selectedFile.name,
        type: documentType,
        category: documentType.includes('Card') || documentType.includes('License') || documentType.includes('Passport') 
          ? 'Personal Documents' 
          : documentType.includes('Policy') 
            ? 'Policy Documents' 
            : documentType.includes('Claim') 
              ? 'Claim Documents' 
              : 'Other',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Admin',
        fileType: selectedFile.type,
        originalName: selectedFile.name
      };

      setDocuments([...documents, newDocument]);
      setOpenUploadDialog(false);
      setSelectedFile(null);
      setDocumentType('');
      setSnackbar({ 
        open: true, 
        message: 'Document uploaded successfully', 
        severity: 'success' 
      });
    } else {
      setSnackbar({ 
        open: true, 
        message: 'Please select both a file and document type', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    setSnackbar({ 
      open: true, 
      message: 'Document deleted successfully', 
      severity: 'info' 
    });
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    
    const storedFile = documentFiles[document.originalName];
    if (storedFile) {
      setPreviewUrl(storedFile.url);
    }
    
    setViewDialog(true);
  };

  const handleCloseView = () => {
    setPreviewUrl(null);
    setSelectedDocument(null);
    setViewDialog(false);
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    return 'other';
  };

  const handleDownloadDocument = async (docItem) => {
    try {
      const storedFile = documentFiles[docItem.originalName];
      
      if (!storedFile) {
        throw new Error('File not found in storage');
      }

      // Create download link
      const link = document.createElement('a');
      link.href = storedFile.url;
      link.download = docItem.originalName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({ 
        open: true, 
        message: `Downloading: ${docItem.name}`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Download error:', error);
      setSnackbar({ 
        open: true, 
        message: `Error downloading file: ${error.message}`, 
        severity: 'error' 
      });
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCustomer = !selectedCustomer || doc.customerId === selectedCustomer.id;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || doc.category === filterCategory;
    return matchesCustomer && matchesSearch && matchesFilter;
  });

  // Add function to get category count for current customer
  const getCategoryCount = (category) => {
    const customerDocs = documents.filter(doc => !selectedCustomer || doc.customerId === selectedCustomer.id);
    if (category === 'All') {
      return customerDocs.length;
    }
    return customerDocs.filter(doc => doc.category === category).length;
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup object URLs
      Object.values(documentFiles).forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "#0C47A0" }}>
        Document Management
      </Typography>

      {/* Customer Selection Section */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#0C47A0" }}>
          Select Customer
        </Typography>
        {customers && customers.length > 0 ? (
          <Autocomplete
            value={selectedCustomer}
            onChange={(event, newValue) => setSelectedCustomer(newValue)}
            options={customers}
            getOptionLabel={(option) => `${option.name} (${option.phone})`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Customer"
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  "& .MuiInputLabel-root": { color: "black" },
                  "& .MuiOutlinedInput-root": { color: "black" }
                }}
              />
            )}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonIcon sx={{ fontSize: 60, color: "#0C47A0", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#0C47A0", fontWeight: "500" }}>
              No customers available
            </Typography>
            <Typography variant="body1" sx={{ color: "#0C47A0", mt: 1, opacity: 0.8 }}>
              Please add customers first
            </Typography>
          </Box>
        )}
      </Paper>

      {selectedCustomer ? (
        <>
          {/* Document Upload Section */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" sx={{ color: "#0C47A0" }}>
                Upload New Document
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ 
                  backgroundColor: "#0C47A0",
                  "&:hover": { backgroundColor: "#1565c0" }
                }}
              >
                Select File
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </Stack>
          </Paper>

          {/* Document List Section */}
          <Paper sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#0C47A0" }}>
              Customer Documents
            </Typography>
            
            {/* Search and Filter Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                variant="outlined"
                placeholder="Search documents..."
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ 
                  minWidth: 200,
                  flexGrow: 1,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiInputLabel-root": { color: "black" },
                  "& .MuiOutlinedInput-root": { color: "black" }
                }}
              />
              <TextField
                select
                variant="outlined"
                label="Filter by Category"
                value={filterCategory}
                onChange={handleFilterChange}
                sx={{ 
                  minWidth: 200,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiInputLabel-root": { color: "black" },
                  "& .MuiOutlinedInput-root": { color: "black" }
                }}
                InputProps={{ startAdornment: <FilterIcon sx={{ mr: 1 }} /> }}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <Typography>{category}</Typography>
                      <Chip 
                        label={getCategoryCount(category)} 
                        size="small"
                        sx={{ 
                          ml: 1,
                          backgroundColor: category === filterCategory ? "#0C47A0" : "grey.400",
                          color: "white"
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Category Pills */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map(category => (
                <Chip
                  key={category}
                  label={`${category} (${getCategoryCount(category)})`}
                  onClick={() => setFilterCategory(category)}
                  sx={{
                    backgroundColor: category === filterCategory ? "#0C47A0" : "white",
                    color: category === filterCategory ? "white" : "black",
                    '&:hover': {
                      backgroundColor: category === filterCategory ? "#1565c0" : "#f5f5f5"
                    }
                  }}
                />
              ))}
            </Box>

            {/* Documents Grid */}
            {filteredDocuments.length > 0 ? (
              <Grid container spacing={3}>
                {filteredDocuments.map((doc) => (
                  <Grid item xs={12} sm={6} md={4} key={doc.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      backgroundColor: "white",
                      boxShadow: 3,
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease"
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <DocumentIcon sx={{ mr: 1, color: "#0C47A0" }} />
                          <Typography variant="h6" component="div" sx={{ color: "#0C47A0" }}>
                            {doc.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Category: {doc.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Type: {doc.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Uploaded: {doc.uploadDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Size: {doc.size}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uploaded by: {doc.uploadedBy}
                        </Typography>
                        <Chip
                          label={doc.status}
                          color={doc.status === 'Active' ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                      <CardActions>
                        <Tooltip title="View Document">
                          <IconButton 
                            color="primary" 
                            sx={{ color: "#0C47A0" }}
                            onClick={() => handleViewDocument(doc)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton 
                            color="primary" 
                            sx={{ color: "#0C47A0" }}
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteDocument(doc.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                backgroundColor: 'white',
                borderRadius: 1,
                mt: 2
              }}>
                <DocumentIcon sx={{ fontSize: 60, color: '#0C47A0', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Documents Found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {searchTerm 
                    ? "No documents match your search criteria" 
                    : filterCategory !== 'All'
                      ? `No documents found in ${filterCategory} category`
                      : "No documents have been uploaded yet"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  sx={{ 
                    mt: 2,
                    backgroundColor: "#0C47A0",
                    "&:hover": { backgroundColor: "#1565c0" }
                  }}
                  onClick={() => document.querySelector('input[type="file"]').click()}
                >
                  Upload Document
                </Button>
              </Box>
            )}
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: "#f5f5f5" }}>
          <PersonIcon sx={{ fontSize: 60, color: "#0C47A0", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Please select a customer to view their documents
          </Typography>
        </Paper>
      )}

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle sx={{ color: "#0C47A0" }}>Upload Document</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Selected File: {selectedFile.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
              </Typography>
              <TextField
                select
                fullWidth
                label="Document Type"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                sx={{ mt: 2 }}
              >
                {documentTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadConfirm} 
            variant="contained" 
            sx={{ 
              backgroundColor: "#0C47A0",
              "&:hover": { backgroundColor: "#1565c0" }
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={handleCloseView}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: "#0C47A0", 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6">
            {selectedDocument?.name}
          </Typography>
          <IconButton onClick={handleCloseView} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {selectedDocument && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Document Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Type:</strong> {selectedDocument.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Category:</strong> {selectedDocument.category}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Upload Date:</strong> {selectedDocument.uploadDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Size:</strong> {selectedDocument.size}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <strong>File Name:</strong> {selectedDocument.originalName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  mt: 2, 
                  minHeight: '400px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  p: 2
                }}>
                  {previewUrl ? (
                    selectedDocument.fileType?.startsWith('image/') ? (
                      <img 
                        src={previewUrl} 
                        alt={selectedDocument.name}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '400px',
                          objectFit: 'contain'
                        }}
                      />
                    ) : selectedDocument.fileType === 'application/pdf' ? (
                      <iframe
                        src={previewUrl}
                        title={selectedDocument.name}
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <DocumentIcon sx={{ fontSize: 60, color: '#0C47A0', mb: 2 }} />
                        <Typography variant="body1">
                          Preview not available for this file type.
                          <br />
                          Click the download button below to view the file.
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <DocumentIcon sx={{ fontSize: 60, color: '#0C47A0', mb: 2 }} />
                      <Typography variant="body1">
                        Document preview not available.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
          {selectedDocument && (
            <Button
              variant="contained"
              onClick={() => handleDownloadDocument(selectedDocument)}
              startIcon={<DownloadIcon />}
              sx={{ 
                backgroundColor: "#0C47A0",
                "&:hover": { backgroundColor: "#1565c0" }
              }}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default Documents;
