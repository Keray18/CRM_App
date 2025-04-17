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

const MyLeads = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample data - replace with actual data from your backend
  const leads = [
    {
      id: 1,
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john.doe@example.com',
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
      source: 'Social Media',
      status: 'Converted',
      assignedDate: '2024-03-13',
      lastContact: '2024-03-14',
    },
  ];

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
      <Typography variant="h5" gutterBottom color="primary">
        My Leads
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Date</TableCell>
                <TableCell>Last Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleCall(lead.phone)}
                          >
                            <PhoneIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEmail(lead.email)}
                          >
                            <EmailIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        color={getStatusColor(lead.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{lead.assignedDate}</TableCell>
                    <TableCell>{lead.lastContact}</TableCell>
                    <TableCell>
                      <Tooltip title="View Lead">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(lead.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Lead">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(lead.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default MyLeads; 