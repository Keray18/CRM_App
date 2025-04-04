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
  Modal,
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
    policy: "", 
    remarks: "",
    date: dayjs().format('YYYY-MM-DD'),
    status: "New"
  });
  const [openConvertModal, setOpenConvertModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleLeadChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const validateLead = () => {
    if (!leadData.name || !leadData.phone) {
      setSnackbar({ open: true, message: "Name and phone are required", severity: "error" });
      return false;
    }
    return true;
  };

  const handleAddLead = () => {
    if (!validateLead()) return;
    
    const newLead = { ...leadData, id: Date.now() };
    setLeads([...leads, newLead]);
    setLeadData({ 
      name: "", 
      phone: "", 
      email: "",
      policy: "", 
      remarks: "",
      date: dayjs().format('YYYY-MM-DD'),
      status: "New"
    });
    setSnackbar({ open: true, message: "Lead added successfully", severity: "success" });
  };

  const handleConvertLead = (lead) => {
    setSelectedLead(lead);
    setOpenConvertModal(true);
  };

  const handleDeleteLead = (lead) => {
    setSelectedLead(lead);
    setOpenDeleteModal(true);
  };

  const confirmLeadConversion = () => {
    addCustomer(selectedLead);
    setLeads(leads.filter(l => l.id !== selectedLead.id));
    setOpenConvertModal(false);
    setSnackbar({ open: true, message: "Lead converted to customer successfully", severity: "success" });
  };

  const confirmLeadDeletion = () => {
    setLeads(leads.filter(l => l.id !== selectedLead.id));
    setOpenDeleteModal(false);
    setSnackbar({ open: true, message: "Lead deleted successfully", severity: "info" });
  };

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
              "& .MuiInputLabel-root": { color: "black" }, // Label color
              "& .MuiOutlinedInput-root": { color: "black" } // Text color
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
              "& .MuiInputLabel-root": { color: "black" }, // Label color
              "& .MuiOutlinedInput-root": { color: "black" } // Text color
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
              "& .MuiInputLabel-root": { color: "black" }, // Label color
              "& .MuiOutlinedInput-root": { color: "black" } // Text color
            }}
          />
          <TextField 
            name="policy" 
            label="Policy Interested In" 
            value={leadData.policy} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" }, // Label color
              "& .MuiOutlinedInput-root": { color: "black" } // Text color
            }}
          />
        </Box>
        <TextField 
          fullWidth 
          name="remarks" 
          label="Remarks" 
          multiline 
          rows={3} 
          sx={{ 
            mt: 2,
            backgroundColor: "white",
            borderRadius: 1,
            "& .MuiInputLabel-root": { color: "black" }, // Label color
            "& .MuiOutlinedInput-root": { color: "black" } // Text color
          }}
          value={leadData.remarks} 
          onChange={handleLeadChange} 
        />
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={handleAddLead}
        >
          Add Lead
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.light" }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No leads found</TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>
                    <Box>
                      <div>{lead.phone}</div>
                      {lead.email && <div style={{ fontSize: '0.8rem', color: '#666' }}>{lead.email}</div>}
                    </Box>
                  </TableCell>
                  <TableCell>{lead.policy || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status} 
                      color={
                        lead.status === "New" ? "primary" : 
                        lead.status === "Contacted" ? "warning" : 
                        "success"
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.remarks || '-'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Convert to customer">
                      <IconButton color="success" onClick={() => handleConvertLead(lead)}>
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete lead">
                      <IconButton color="error" onClick={() => handleDeleteLead(lead)}>
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

      {/* Convert Lead Modal */}
      <Modal open={openConvertModal} onClose={() => setOpenConvertModal(false)}>
        <Box sx={{ 
          p: 4, 
          backgroundColor: "background.paper", 
          margin: "auto", 
          mt: 10, 
          maxWidth: 400, 
          textAlign: "center", 
          borderRadius: 2, 
          boxShadow: 3 
        }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Convert Lead</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Convert <strong>{selectedLead?.name}</strong> to a customer?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={confirmLeadConversion}>
              Confirm Conversion
            </Button>
            <Button variant="outlined" onClick={() => setOpenConvertModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Lead Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{ 
          p: 4, 
          backgroundColor: "background.paper", 
          margin: "auto", 
          mt: 10, 
          maxWidth: 400, 
          textAlign: "center", 
          borderRadius: 2, 
          boxShadow: 3 
        }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Delete Lead</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{selectedLead?.name}</strong>?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="error" onClick={confirmLeadDeletion}>
              Delete
            </Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Leads;