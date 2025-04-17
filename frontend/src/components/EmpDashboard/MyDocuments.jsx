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
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

const MyDocuments = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample data - replace with actual data from your backend
  const documents = [
    {
      id: 1,
      title: 'Policy Document - ABC123',
      type: 'Policy',
      uploadDate: '2024-03-15',
      size: '2.5 MB',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Client Agreement - XYZ789',
      type: 'Agreement',
      uploadDate: '2024-03-16',
      size: '1.8 MB',
      status: 'Active',
    },
    {
      id: 3,
      title: 'Insurance Certificate - DEF456',
      type: 'Certificate',
      uploadDate: '2024-03-17',
      size: '3.2 MB',
      status: 'Active',
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpload = () => {
    // Implement file upload functionality
    console.log('Upload document');
  };

  const handleDownload = (documentId) => {
    // Implement document download functionality
    console.log('Download document:', documentId);
  };

  const handleView = (documentId) => {
    // Implement document view functionality
    console.log('View document:', documentId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" color="primary">
          My Documents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleUpload}
        >
          Upload Document
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>
                      <Tooltip title="View Document">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(doc.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Document">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownload(doc.id)}
                        >
                          <DownloadIcon />
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
          count={documents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default MyDocuments; 