import React,{useState} from "react";
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

const Leads = ({ leads, setLeads, addCustomer }) => {
  const [leadData, setLeadData] = useState({ 
    name: "", 
    phone: "", 
    email: "",
    remarks: "",
    date: dayjs().format('YYYY-MM-DD'),
    status: "New",
    policy: "",
    proposalDocument: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

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
      setLeadData({ ...leadData, proposalDocument: file });
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!leadData.name || !leadData.phone) {
      setSnackbar({
        open: true,
        message: "Name and Phone are required fields",
        severity: "error"
      });
      return;
    }

    // Create new lead
    const newLead = {
      id: Date.now(),
      ...leadData,
      createdAt: new Date().toISOString(),
      isConverted: false,
      isDeleted: false
    };

    // Add to leads list
    setLeads(prevLeads => [...prevLeads, newLead]);
    
    // Reset form
    setLeadData({ 
      name: "", 
      phone: "", 
      email: "",
      remarks: "",
      date: dayjs().format('YYYY-MM-DD'),
      status: "New",
      policy: "",
      proposalDocument: null
    });

    setSnackbar({
      open: true,
      message: "Lead created successfully",
      severity: "success"
    });
  };

  const handleAcceptLead = (lead) => {
    // Convert lead to customer
    const newCustomer = {
      id: Date.now(),
      leadId: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      policyInterested: lead.policy,
      status: "Active",
      createdFrom: "Lead",
      createdAt: new Date().toISOString(),
      conversionDate: new Date().toISOString()
    };

    // Mark lead as converted
    setLeads(prevLeads => 
      prevLeads.map(l => 
        l.id === lead.id 
          ? { ...l, isConverted: true } 
          : l
      )
    );

    // Add customer
    addCustomer(newCustomer);

    setSnackbar({
      open: true,
      message: "Lead successfully converted to customer",
      severity: "success"
    });
  };

  const handleDeleteLead = (leadId) => {
    // Mark lead as deleted
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, isDeleted: true } 
          : lead
      )
    );

    setSnackbar({
      open: true,
      message: "Lead deleted successfully",
      severity: "info"
    });
  };

  // Filter active leads (not converted and not deleted)
  const activeLeads = leads.filter(lead => !lead.isConverted && !lead.isDeleted);

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
              name="name" 
              label="Lead Name" 
              required 
              value={leadData.name} 
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
              name="phone" 
              label="Phone" 
              required 
              value={leadData.phone} 
              onChange={handleLeadChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              name="email" 
              label="Email" 
              type="email" 
              value={leadData.email} 
              onChange={handleLeadChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Policy Type</InputLabel>
              <Select
                name="policy"
                value={leadData.policy}
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
              name="date" 
              type="date"
              value={leadData.date} 
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
              {leadData.proposalDocument && (
                <Typography variant="body2" sx={{ mt: 1, color: '#0C47A0', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16 }} />
                  {leadData.proposalDocument.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              name="remarks" 
              label="Remarks" 
              multiline
              rows={2}
              value={leadData.remarks} 
              onChange={handleLeadChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              fullWidth
              size="large"
              sx={{ 
                bgcolor: "#0C47A0",
                color: "white",
                "&:hover": {
                  bgcolor: "#1565c0"
                }
              }}
            >
              Create Lead
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Active Leads Table */}
      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#0C47A0" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Lead Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Policy Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No active leads</TableCell>
              </TableRow>
            ) : (
              activeLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#0C47A0" }}>
                        {lead.name.charAt(0)}
                      </Avatar>
                      {lead.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography>{lead.phone}</Typography>
                      {lead.email && (
                        <Typography variant="body2" color="textSecondary">
                          {lead.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {lead.policy ? (
                      <Chip 
                        label={policyTypes.find(t => t.value === lead.policy)?.label || lead.policy}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "#0C47A0" }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">Not specified</Typography>
                    )}
                  </TableCell>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status}
                      color="primary"
                      size="small"
                      sx={{ bgcolor: "#0C47A0" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Convert to Customer">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleAcceptLead(lead)}
                        sx={{ color: "#0C47A0" }}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
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

export default Leads;