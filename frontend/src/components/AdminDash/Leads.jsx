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
  Chip
} from "@mui/material";
import { CheckCircle, Delete } from "@mui/icons-material";
import dayjs from "dayjs";

const Leads = ({ leads, setLeads, addCustomer }) => {
  const [leadData, setLeadData] = useState({ 
    name: "", 
    phone: "", 
    email: "",
    remarks: "",
    date: dayjs().format('YYYY-MM-DD'),
    status: "New"
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setLeadData({ ...leadData, [name]: value });
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
      status: "New"
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
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "primary.main" }}>
        Lead Management
      </Typography>
      
      <Box sx={{ mb: 3, p: 3, backgroundColor: "#252525", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>Add New Lead</Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
          <TextField 
            name="name" 
            label="Lead Name" 
            required 
            value={leadData.name} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": { color: "black" }
            }}
          />
          <TextField 
            name="phone" 
            label="Phone" 
            required 
            value={leadData.phone} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": { color: "black" }
            }}
          />
          <TextField 
            name="email" 
            label="Email" 
            type="email" 
            value={leadData.email} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": { color: "black" }
            }}
          />
          <TextField 
            name="date" 
            type="date"
            value={leadData.date} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": { color: "black" }
            }}
            inputProps={{
              placeholder: "dd-mm-yy"
            }}
          />
          <TextField 
            name="remarks" 
            label="Remarks" 
            multiline
            rows={2}
            value={leadData.remarks} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": { color: "black" }
            }}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ 
              backgroundColor: "#0C47A0",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0"
              }
            }}
          >
            Create Lead
          </Button>
        </Box>
      </Box>

      {/* Active Leads Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Lead Name</TableCell>
              <TableCell sx={{ color: "white" }}>Contact</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No active leads</TableCell>
              </TableRow>
            ) : (
              activeLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{lead.name}</TableCell>
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
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Convert to Customer">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleAcceptLead(lead)}
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