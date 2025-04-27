import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  InputAdornment
} from "@mui/material";
import { CheckCircle, Delete, Upload as UploadIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from 'axios';
import { API_URL } from "../../config/config";

const Leads = ({ leads, setLeads, addCustomer }) => {
  const [leadData, setLeadData] = useState({ 
    leadName: "", 
    leadPhone: "", 
    leadEmail: "",
    leadPolicyType: "",
    leadCreateDate: dayjs().format('YYYY-MM-DD'),
    remarks: "",
    document: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [loading, setLoading] = useState(false);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setSnackbar({
        open: true,
        message: "Error fetching leads",
        severity: "error"
      });
    }
  };

  const policyTypes = [
    { value: "health", label: "Health Insurance" },
    { value: "travel", label: "Travel Insurance" },
    { value: "vehicle", label: "Vehicle Insurance" }
  ];

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setLeadData({ ...leadData, [name]: value });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLeadData({ ...leadData, document: file });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!leadData.leadName || !leadData.leadPhone || !leadData.leadEmail || !leadData.leadPolicyType) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(leadData).forEach(key => {
        if (key === 'document' && leadData[key]) {
          formData.append('document', leadData[key]);
        } else {
          formData.append(key, leadData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/leads/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add to leads list
      setLeads(prevLeads => [...prevLeads, response.data.lead]);
      
      // Reset form
      setLeadData({ 
        leadName: "", 
        leadPhone: "", 
        leadEmail: "",
        leadPolicyType: "",
        leadCreateDate: dayjs().format('YYYY-MM-DD'),
        remarks: "",
        document: null
      });

      setSnackbar({
        open: true,
        message: "Lead created successfully",
        severity: "success"
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error creating lead",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await axios.delete(`${API_URL}/leads/${leadId}`);
      
      // Update leads list
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));

      setSnackbar({
        open: true,
        message: "Lead deleted successfully",
        severity: "info"
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      setSnackbar({
        open: true,
        message: "Error deleting lead",
        severity: "error"
      });
    }
  };

  const handleUpdateRemarks = async (leadId, remarks) => {
    try {
      const response = await axios.patch(`${API_URL}/leads/${leadId}/remarks`, { remarks });
      
      // Update leads list
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? response.data.lead 
            : lead
        )
      );

      setSnackbar({
        open: true,
        message: "Remarks updated successfully",
        severity: "success"
      });
    } catch (error) {
      console.error('Error updating remarks:', error);
      setSnackbar({
        open: true,
        message: "Error updating remarks",
        severity: "error"
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "#0C47A0" }}>
        Lead Management
      </Typography>
      
      <Box sx={{ mb: 3, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#0C47A0", fontWeight: "bold" }}>Add New Lead</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              name="leadName" 
              label="Lead Name" 
              required 
              value={leadData.leadName} 
              onChange={handleLeadChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar sx={{ width: 24, height: 24 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="leadPhone" 
              label="Phone" 
              required 
              value={leadData.leadPhone} 
              onChange={handleLeadChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="leadEmail" 
              label="Email" 
              type="email" 
              required
              value={leadData.leadEmail} 
              onChange={handleLeadChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Policy Type</InputLabel>
              <Select
                name="leadPolicyType"
                value={leadData.leadPolicyType}
                onChange={handleLeadChange}
                label="Policy Type"
              >
                {policyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="leadCreateDate" 
              type="date"
              value={leadData.leadCreateDate} 
              onChange={handleLeadChange}
              fullWidth
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              border: '1px dashed #0C47A0',
              borderRadius: 1,
              height: '100%',
              backgroundColor: '#f0f7ff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <Typography variant="subtitle2" sx={{ color: '#0C47A0', fontWeight: 'bold' }}>
                Upload Proposal Document
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center', mb: 1 }}>
                Supported formats: PDF, DOC, DOCX
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  borderColor: '#0C47A0',
                  color: '#0C47A0',
                  '&:hover': {
                    backgroundColor: '#f5f9ff',
                    borderColor: '#0C47A0'
                  }
                }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
              </Button>
              {leadData.document && (
                <Typography variant="body2" sx={{ mt: 1, color: '#0C47A0', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16 }} />
                  {leadData.document.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="remarks"
              label="Remarks"
              value={leadData.remarks}
              onChange={handleLeadChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                bgcolor: "#0C47A0",
                color: "white",
                "&:hover": {
                  bgcolor: "#1565c0"
                }
              }}
            >
              {loading ? "Creating..." : "Create Lead"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#0C47A0" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Lead Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Policy Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Remarks</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No leads found</TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {lead.leadName ? lead.leadName.charAt(0) : '?'}
                      </Avatar>
                      {lead.leadName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography>{lead.leadPhone}</Typography>
                      {lead.leadEmail && (
                        <Typography variant="body2" color="textSecondary">
                          {lead.leadEmail}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {lead.leadPolicyType ? (
                      <Chip 
                        label={policyTypes.find(t => t.value === lead.leadPolicyType)?.label || lead.leadPolicyType}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "#0C47A0" }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">Not specified</Typography>
                    )}
                  </TableCell>
                  <TableCell>{dayjs(lead.leadCreateDate).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={lead.remarks || ''}
                      onChange={(e) => handleUpdateRemarks(lead.id, e.target.value)}
                      placeholder="Add remarks..."
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Delete Lead">
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default Leads;