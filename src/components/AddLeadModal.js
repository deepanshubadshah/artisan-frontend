// src/components/AddLeadModal.js
import React, { useState } from "react";
import { createLead, updateLead } from "../api/leadsApi";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const AddLeadModal = ({ onClose, existingLead, onSuccess }) => {
  // Field states
  const [name, setName] = useState(existingLead?.name || "");
  const [email, setEmail] = useState(existingLead?.email || "");
  const [company, setCompany] = useState(existingLead?.company || "");
  const [phone, setPhone] = useState(existingLead?.phone || "");
  const [stage, setStage] = useState(existingLead?.stage || "New");
  const [engaged, setEngaged] = useState(existingLead?.engaged || false);
  const initialLastContacted = existingLead?.last_contacted ? dayjs(existingLead.last_contacted) : null;
  const [lastContacted, setLastContacted] = useState(initialLastContacted);
  const [saving, setSaving] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});

  // Validate required fields and email format
  const validate = () => {
    let tempErrors = {};
    if (!name.trim()) tempErrors.name = "Name is required";
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else {
      // Basic email pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = "Invalid email address";
      }
    }
    // Set errors; if any exist, validation fails.
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return; // Stop submission if validation fails
    try {
      setSaving(true);
      const leadData = {
        name,
        email,
        company,
        phone,
        stage,
        engaged,
        last_contacted: lastContacted && lastContacted.isValid() ? lastContacted.format("YYYY-MM-DD") : null,
      };
      if (existingLead) {
        await updateLead(existingLead.id, leadData);
        toast.info("Lead updated successfully!");
      } else {
        await createLead(leadData);
        toast.success("Lead created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      // Show detailed error from API (e.g. duplicate email error)
      const errMsg = error.response?.data?.detail || "Error saving lead";
      console.error("Error saving lead:", error);
      toast.error(errMsg);
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {existingLead ? "Edit Lead" : "Add Lead"}
        <Button
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            variant="outlined"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            label="Company"
            variant="outlined"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="stage-label">Stage</InputLabel>
            <Select
              labelId="stage-label"
              label="Stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Proposal">Proposal</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={engaged}
                onChange={(e) => setEngaged(e.target.checked)}
                color="primary"
              />
            }
            label="Engaged"
            
          />
          <DesktopDatePicker
            label="Last Contacted"
            value={lastContacted}
            onChange={(newValue) => setLastContacted(newValue)}
            format="YYYY-MM-DD"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            )}
            
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving} variant="contained" color="primary">
          {saving ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLeadModal;