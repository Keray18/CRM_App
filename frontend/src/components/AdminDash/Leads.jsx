import React, { useState, useEffect, useCallback } from "react";
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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
  TablePagination,
  InputBase,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Delete,
  Edit,
  Visibility,
  Upload as UploadIcon,
  Warning,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../../config/config";
import authHeader from '../../services/authHeader';

const Leads = ({ leads, setLeads, addCustomer }) => {
  const [leadData, setLeadData] = useState({
    leadName: "",
    leadPhone: "",
    leadEmail: "",
    leadPolicyType: "",
    leadCreateDate: dayjs().format("YYYY-MM-DD"),
    remarks: "",
    document: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    leadId: null,
    leadName: "",
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination and filtering states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPolicyType, setFilterPolicyType] = useState("all");
  const [sortField, setSortField] = useState("leadCreateDate");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filtered and sorted leads with safe value handling
  const filteredLeads = leads
    .filter((lead) => {
      if (!lead) return false;

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        (lead.leadName?.toLowerCase() || "").includes(searchTermLower) ||
        (lead.leadEmail?.toLowerCase() || "").includes(searchTermLower) ||
        (lead.leadPhone || "").includes(searchTerm);

      const matchesPolicyType =
        filterPolicyType === "all" || lead.leadPolicyType === filterPolicyType;

      return matchesSearch && matchesPolicyType;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;

      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Paginated leads
  const paginatedLeads = filteredLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle policy type filter
  const handlePolicyTypeFilter = (event) => {
    setFilterPolicyType(event.target.value);
    setPage(0);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterPolicyType("all");
    setSortField("leadCreateDate");
    setSortDirection("desc");
    setPage(0);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Memoize fetchLeads to prevent unnecessary re-renders
  const fetchLeads = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(`${API_URL}/leads`, { headers: getAuthHeaders() });
      if (response.data && response.data.leads) {
        setLeads(response.data.leads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error fetching leads",
        severity: "error",
      });
    } finally {
      setTableLoading(false);
    }
  }, [setLeads]);

  const convertLeadsToCSV = (data) => {
    if (!data || !data.length) return "";
    const keys = [
      "leadName",
      "leadPhone",
      "leadEmail",
      "leadPolicyType",
      "leadCreateDate",
      "remarks",
    ];
    const csvRows = [
      keys.join(","), // header
      ...data.map((row) =>
        keys
          .map((k) => `"${(row[k] ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  // Download handler
  const handleDownloadCSV = () => {
    const csv = convertLeadsToCSV(filteredLeads); // Use filteredLeads for current view
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
    // Fetch policy types from master data
    const fetchPolicyTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/masterdata/type/Policy Type"
        );
        setPolicyTypes(
          response.data
            .filter((item) => item.isActive)
            .map((item) => ({ value: item.name, label: item.name }))
        );
      } catch (error) {
        setPolicyTypes([]);
      }
    };
    fetchPolicyTypes();
  }, [fetchLeads]);

  const [policyTypes, setPolicyTypes] = useState([]);

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setLeadData({ ...leadData, [name]: value });
  };

  // Debounced remarks update
  const [remarksTimeout, setRemarksTimeout] = useState(null);
  const handleUpdateRemarks = (leadId, remarks) => {
    // Clear any existing timeout
    if (remarksTimeout) {
      clearTimeout(remarksTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(async () => {
      try {
        const response = await axios.patch(
          `${API_URL}/leads/${leadId}/remarks`,
          { remarks }
        );

        if (response.data && response.data.lead) {
          setLeads((prevLeads) =>
            prevLeads.map((lead) =>
              lead.id === leadId ? response.data.lead : lead
            )
          );

          setSnackbar({
            open: true,
            message: "Remarks updated successfully",
            severity: "success",
          });
        }
      } catch (error) {
        console.error("Error updating remarks:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Error updating remarks",
          severity: "error",
        });
      }
    }, 1000); // Wait for 1 second of no typing before sending request

    setRemarksTimeout(timeout);
  };

  // Optimized file upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "File size should be less than 5MB",
        severity: "error",
      });
      event.target.value = null; // Reset file input
      return;
    }

    // Check file type
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setSnackbar({
        open: true,
        message: "Only PDF, DOC, and DOCX files are allowed",
        severity: "error",
      });
      event.target.value = null; // Reset file input
      return;
    }

    setLeadData((prev) => ({ ...prev, document: file }));
    setSnackbar({
      open: true,
      message: "File selected successfully",
      severity: "success",
    });
  };

  // Optimized submit handler
  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = [
      "leadName",
      "leadPhone",
      "leadEmail",
      "leadPolicyType",
    ];
    const missingFields = requiredFields.filter((field) => !leadData[field]);

    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
        severity: "error",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.leadEmail)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(leadData.leadPhone)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid 10-digit phone number",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(leadData).forEach((key) => {
        if (key === "document" && leadData[key]) {
          formData.append("document", leadData[key]);
        } else if (leadData[key] !== null && leadData[key] !== undefined) {
          formData.append(key, leadData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/leads/submit`, formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data"
        },
      });

      if (response.data && response.data.lead) {
        setLeads((prevLeads) => [...prevLeads, response.data.lead]);

        // Reset form
        setLeadData({
          leadName: "",
          leadPhone: "",
          leadEmail: "",
          leadPolicyType: "",
          leadCreateDate: dayjs().format("YYYY-MM-DD"),
          remarks: "",
          document: null,
        });

        setSnackbar({
          open: true,
          message: "Lead created successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error creating lead",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (lead) => {
    setDeleteDialog({
      open: true,
      leadId: lead.id,
      leadName: lead.leadName,
    });
  };

  // Optimized delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.leadId) return;

    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${API_URL}/leads/${deleteDialog.leadId}`
      );

      if (response.status === 200) {
        setLeads((prevLeads) =>
          prevLeads.filter((lead) => lead.id !== deleteDialog.leadId)
        );
        setSnackbar({
          open: true,
          message: `Lead "${deleteDialog.leadName}" deleted successfully`,
          severity: "info",
        });
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error deleting lead",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, leadId: null, leadName: "" });
    }
  };

  // Cleanup function for remarks timeout
  useEffect(() => {
    return () => {
      if (remarksTimeout) {
        clearTimeout(remarksTimeout);
      }
    };
  }, [remarksTimeout]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        sx={{ color: "#0C47A0" }}
      >
        Lead Management
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#0C47A0", fontWeight: "bold" }}
        >
          Add New Lead
        </Typography>
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
              placeholder="Enter 10-digit phone number"
              inputProps={{ maxLength: 10 }}
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
              placeholder="example@email.com"
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
              component="label"
              startIcon={<UploadIcon />}
              sx={{ mr: 2 }}
            >
              Upload Document
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </Button>
            {leadData.document && (
              <Chip
                label={leadData.document.name}
                onDelete={() => setLeadData({ ...leadData, document: null })}
                color="primary"
                variant="outlined"
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Creating Lead..." : "Create Lead"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#0C47A0", fontWeight: "bold" }}
          >
            Lead List
          </Typography>

          {/* Search and Filter Section */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Search Input */}
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 300,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search leads..."
                value={searchTerm}
                onChange={handleSearch}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
              {searchTerm && (
                <IconButton
                  sx={{ p: "10px" }}
                  onClick={() => setSearchTerm("")}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </Paper>

            {/* Policy Type Filter */}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Policy Type</InputLabel>
              <Select
                value={filterPolicyType}
                onChange={handlePolicyTypeFilter}
                label="Policy Type"
                size="small"
              >
                <MenuItem value="all">All Types</MenuItem>
                {policyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters Button */}
            {(searchTerm || filterPolicyType !== "all") && (
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 0 }}>
          {/* ...existing code... */}
          <Box sx={{ mt: 0 }}>
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {/* ...existing search/filter UI... */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDownloadCSV}
                >
                  Download CSV
                </Button>
              </Box>
            </Box>
            {/* ...existing table and rest of the code... */}
          </Box>
          {/* ...existing code... */}
        </Box>

        <TableContainer component={Paper} sx={{ position: "relative" }}>
          {tableLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => handleSort("leadName")}
                  sx={{ cursor: "pointer" }}
                >
                  Name{" "}
                  {sortField === "leadName" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("leadPhone")}
                  sx={{ cursor: "pointer" }}
                >
                  Phone{" "}
                  {sortField === "leadPhone" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("leadEmail")}
                  sx={{ cursor: "pointer" }}
                >
                  Email{" "}
                  {sortField === "leadEmail" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell>Policy Type</TableCell>
                <TableCell
                  onClick={() => handleSort("leadCreateDate")}
                  sx={{ cursor: "pointer" }}
                >
                  Create Date{" "}
                  {sortField === "leadCreateDate" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm || filterPolicyType !== "all"
                      ? "No leads match your search criteria"
                      : "No leads found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeads.map((lead) => (
                  <TableRow key={lead?.id || Math.random()} hover>
                    <TableCell>{lead?.leadName || "-"}</TableCell>
                    <TableCell>{lead?.leadPhone || "-"}</TableCell>
                    <TableCell>{lead?.leadEmail || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead?.leadPolicyType || "Unknown"}
                        color={
                          lead?.leadPolicyType === "health"
                            ? "success"
                            : lead?.leadPolicyType === "travel"
                            ? "warning"
                            : "primary"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {lead?.leadCreateDate
                        ? dayjs(lead.leadCreateDate).format("DD/MM/YYYY")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={lead?.remarks || ""}
                        onChange={(e) =>
                          handleUpdateRemarks(lead?.id, e.target.value)
                        }
                        placeholder="Add remarks"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete Lead">
                        <IconButton
                          color="error"
                          onClick={() => lead?.id && handleDeleteClick(lead)}
                          // disabled={!lead?.id}
                          disabled={localStorage.getItem('userRole') === 'standard'}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Lead">
                        <IconButton
                          disabled={localStorage.getItem('userRole') === 'standard'}
                          >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Lead">
                        <IconButton>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          !deleteLoading &&
          setDeleteDialog({ open: false, leadId: null, leadName: "" })
        }
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Warning color="warning" />
            <Typography>
              Are you sure you want to delete the lead "{deleteDialog.leadName}
              "? This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({ open: false, leadId: null, leadName: "" })
            }
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Leads;
