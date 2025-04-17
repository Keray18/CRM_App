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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as RenewIcon,
} from '@mui/icons-material';

const MyPolicies = ({ policies, setPolicies }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRenewDialog, setOpenRenewDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [editPolicy, setEditPolicy] = useState(null);
  const [renewPolicy, setRenewPolicy] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expired':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setOpenViewDialog(true);
  };

  const handleEdit = (policy) => {
    setEditPolicy({ ...policy });
    setOpenEditDialog(true);
  };

  const handleDelete = (policy) => {
    setSelectedPolicy(policy);
    setOpenDeleteDialog(true);
  };

  const handleRenew = (policy) => {
    setRenewPolicy({ ...policy });
    setOpenRenewDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editPolicy) return;

    setPolicies(policies.map(policy => 
      policy.id === editPolicy.id 
        ? { ...editPolicy }
        : policy
    ));

    setOpenEditDialog(false);
    setEditPolicy(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedPolicy) return;

    setPolicies(policies.filter(policy => policy.id !== selectedPolicy.id));
    setOpenDeleteDialog(false);
    setSelectedPolicy(null);
  };

  const handleConfirmRenew = () => {
    if (!renewPolicy) return;

    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const renewedPolicy = {
      ...renewPolicy,
      startDate: today.toISOString().split('T')[0],
      endDate: nextYear.toISOString().split('T')[0],
      status: 'Active',
      premium: renewPolicy.premium * 1.1, // 10% increase in premium
    };

    setPolicies(policies.map(policy => 
      policy.id === renewedPolicy.id 
        ? renewedPolicy
        : policy
    ));

    setOpenRenewDialog(false);
    setRenewPolicy(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        My Policies
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Policy Number</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((policy) => (
                  <TableRow key={policy.id} hover>
                    <TableCell>{policy.policyNumber}</TableCell>
                    <TableCell>{policy.clientName}</TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>{policy.startDate}</TableCell>
                    <TableCell>{policy.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={policy.status}
                        color={getStatusColor(policy.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{policy.premium}</TableCell>
                    <TableCell>
                      <Tooltip title="View Policy">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(policy)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Policy">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(policy)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {policy.status === 'Expired' && (
                        <Tooltip title="Renew Policy">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleRenew(policy)}
                          >
                            <RenewIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete Policy">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(policy)}
                        >
                          <DeleteIcon />
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
          count={policies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Policy Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>Policy Details</DialogTitle>
        <DialogContent>
          {selectedPolicy && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Policy #{selectedPolicy.policyNumber}
              </Typography>
              <Typography variant="body1" paragraph>
                Client: {selectedPolicy.clientName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Type: {selectedPolicy.type}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Start Date: {selectedPolicy.startDate}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                End Date: {selectedPolicy.endDate}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {selectedPolicy.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Premium: ₹{selectedPolicy.premium}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Policy</DialogTitle>
        <DialogContent>
          {editPolicy && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Policy Number"
                value={editPolicy.policyNumber}
                onChange={(e) => setEditPolicy({ ...editPolicy, policyNumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="Client Name"
                value={editPolicy.clientName}
                onChange={(e) => setEditPolicy({ ...editPolicy, clientName: e.target.value })}
                fullWidth
              />
              <TextField
                select
                label="Type"
                value={editPolicy.type}
                onChange={(e) => setEditPolicy({ ...editPolicy, type: e.target.value })}
                fullWidth
              >
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Life">Life</MenuItem>
                <MenuItem value="Vehicle">Vehicle</MenuItem>
                <MenuItem value="Property">Property</MenuItem>
              </TextField>
              <TextField
                label="Start Date"
                type="date"
                value={editPolicy.startDate}
                onChange={(e) => setEditPolicy({ ...editPolicy, startDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={editPolicy.endDate}
                onChange={(e) => setEditPolicy({ ...editPolicy, endDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Status"
                value={editPolicy.status}
                onChange={(e) => setEditPolicy({ ...editPolicy, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
              <TextField
                label="Premium"
                type="number"
                value={editPolicy.premium}
                onChange={(e) => setEditPolicy({ ...editPolicy, premium: parseFloat(e.target.value) })}
                fullWidth
                InputProps={{
                  startAdornment: '₹',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Policy</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this policy? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Renew Policy Dialog */}
      <Dialog open={openRenewDialog} onClose={() => setOpenRenewDialog(false)}>
        <DialogTitle>Renew Policy</DialogTitle>
        <DialogContent>
          {renewPolicy && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" paragraph>
                You are about to renew the following policy:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Policy Number: {renewPolicy.policyNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Client Name: {renewPolicy.clientName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Type: {renewPolicy.type}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Current Premium: ₹{renewPolicy.premium}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                New Premium (10% increase): ₹{renewPolicy.premium * 1.1}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                New Start Date: {new Date().toISOString().split('T')[0]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                New End Date: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenewDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmRenew} variant="contained" color="success">
            Confirm Renewal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPolicies; 