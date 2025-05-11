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
import PolicyStatus from '../AdminDash/PolicyStatus';

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
      <PolicyStatus />
    </Box>
  );
};

export default MyPolicies; 