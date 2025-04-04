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

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setLeadData({ ...leadData, [name]: value });
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
            name="policy" 
            label="Policy Interested In" 
            value={leadData.policy} 
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
            label="Date" 
            type="date"
            value={leadData.date} 
            onChange={handleLeadChange}
            sx={{ 
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": { color: "black" }
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Leads;