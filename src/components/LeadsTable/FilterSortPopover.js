import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

export default function FilterSortPopover({ initialFilters, onApply, onReset }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Local state for filter fields
  const [stage, setStage] = useState(initialFilters.stage || "");
  const [engaged, setEngaged] = useState(initialFilters.engaged || "");

  // Convert string dates to Dayjs objects if provided, otherwise null
  const initialStartDate = initialFilters.createdAtStart ? dayjs(initialFilters.createdAtStart) : null;
  const initialEndDate = initialFilters.createdAtEnd ? dayjs(initialFilters.createdAtEnd) : null;
  
  const [createdAtStart, setCreatedAtStart] = useState(initialStartDate);
  const [createdAtEnd, setCreatedAtEnd] = useState(initialEndDate);

  const [sortField, setSortField] = useState(initialFilters.sortField || "");

  // Sync internal state when parent's filters are reset/updated
  useEffect(() => {
    setStage(initialFilters.stage || "");
    setEngaged(initialFilters.engaged || "");
    setCreatedAtStart(initialFilters.createdAtStart ? dayjs(initialFilters.createdAtStart) : null);
    setCreatedAtEnd(initialFilters.createdAtEnd ? dayjs(initialFilters.createdAtEnd) : null);
    setSortField(initialFilters.sortField || "");
  }, [initialFilters]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleApply = () => {
    onApply({
      stage,
      engaged,
      createdAtStart: createdAtStart ? createdAtStart.format("YYYY-MM-DD") : "",
      createdAtEnd: createdAtEnd ? createdAtEnd.format("YYYY-MM-DD") : "",
      sortField,
      sortOrder: "desc",
    });
    handleClose();
  };

  const handleReset = () => {
    setStage("");
    setEngaged("");
    setCreatedAtStart(null);
    setCreatedAtEnd(null);
    setSortField("");
    onReset();
    handleClose();
  };

  return (
    <div>
      <button
        className="btn-filter-sort d-flex align-items-center"
        onClick={handleClick}
      >
        <img
          src="/assets/icons/filter.svg"
          alt="Filter & Sort"
          className="me-2"
          style={{ width: "16px", height: "16px" }}
        />
        Filter & Sort
      </button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: 1,
          ".MuiPaper-root": {
            borderRadius: 2,
            width: 320,
          },
        }}
      >
        <Box p={2} display="flex" flexDirection="column" gap={2}>
          {/* Header with close icon */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">
              Filter & Sort
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider />

          {/* Stage Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="stage-label">Stage</InputLabel>
            <Select
              labelId="stage-label"
              label="Stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Proposal">Proposal</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>

          {/* Engaged Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="engaged-label">Engaged</InputLabel>
            <Select
              labelId="engaged-label"
              label="Engaged"
              value={engaged}
              onChange={(e) => setEngaged(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Engaged</MenuItem>
              <MenuItem value="false">Not Engaged</MenuItem>
            </Select>
          </FormControl>

          {/* Date Filters with header "Created At" */}
          <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
            Created At
          </Typography>
          <Box display="flex" gap={1}>
            <DesktopDatePicker
              label="Start"
              value={createdAtStart}
              onChange={(newValue) => setCreatedAtStart(newValue)}
              format="YYYY-MM-DD"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <DesktopDatePicker
              label="End"
              value={createdAtEnd}
              onChange={(newValue) => setCreatedAtEnd(newValue)}
              format="YYYY-MM-DD"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Box>

          {/* Sort By */}
          <FormControl fullWidth size="small">
            <InputLabel id="sortField-label">Sort By</InputLabel>
            <Select
              labelId="sortField-label"
              label="Sort By"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="last_contacted">Last Contacted</MenuItem>
              <MenuItem value="updated_at">Last Updated</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary">
            By default, results will be sorted in descending order (most recent first).
          </Typography>

          {/* Buttons */}
          <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" size="small" onClick={handleApply}>
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
}