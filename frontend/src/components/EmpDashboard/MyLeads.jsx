import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import Leads from 'components/AdminDash/Leads';
import authHeader from '../../services/authHeader';

const MyLeads = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample data - replace with actual data from your backend
  // Replace this:
  // const leads = [ ... ];
  // With this:
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john.doe@example.com',
      address: '123 Main St, City, State',
      source: 'Website',
      status: 'New',
      assignedDate: '2024-03-15',
      lastContact: '2024-03-16',
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+91 9876543211',
      email: 'jane.smith@example.com',
      address: '456 Oak Ave, Town, State',
      source: 'Referral',
      status: 'In Progress',
      assignedDate: '2024-03-14',
      lastContact: '2024-03-15',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      phone: '+91 9876543212',
      email: 'mike.johnson@example.com',
      address: '789 Pine Rd, Village, State',
      source: 'Social Media',
      status: 'Converted',
      assignedDate: '2024-03-13',
      lastContact: '2024-03-14',
    },
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Converted':
        return 'success';
      case 'Lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleView = (leadId) => {
    // Implement lead view functionality
    console.log('View lead:', leadId);
  };

  const handleEdit = (leadId) => {
    // Implement lead edit functionality
    console.log('Edit lead:', leadId);
  };

  const handleCall = (phone) => {
    // Implement call functionality
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    // Implement email functionality
    window.location.href = `mailto:${email}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Leads leads={leads} setLeads={setLeads} />
    </Box>
  );
};

export default MyLeads;