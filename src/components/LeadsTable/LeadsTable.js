import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeads } from "../../api/leadsApi";
import TableRow from "./TableRow";
import Lottie from "lottie-react";
import loaderAnimation from "../../assets/loaderAnimation.json";
import FilterOffIcon from "@mui/icons-material/RestartAlt";
import FilterSortPopover from "./FilterSortPopover"; // Using Popover now instead of Dropdown

// MUI Imports for bottom bar pagination controls
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../../assets/custom.css";

const LeadsTable = ({ onEdit }) => {
  const [search, setSearch] = useState("");
  // Default sort: by created_at in descending order
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  // Note: MUI Pagination uses zero-based indexing for page numbers, so adjust accordingly.
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters state for additional filter options
  const [filters, setFilters] = useState({
    stage: "",
    engaged: "",
    createdAtStart: "",
    createdAtEnd: "",
    sortField: "",
    sortOrder: "desc",
  });

  const skip = (page - 1) * limit;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["leads", skip, limit, search, sortBy, sortOrder, filters],
    queryFn: () =>
      fetchLeads({ skip, limit, search, sortBy, sortOrder, filters }),
    keepPreviousData: true,
  });

  // Destructure leads and total items from data
  const leads = data?.items || data || [];
  const totalItems = data?.total || leads.length;
  const startIndex = skip + 1;
  const endIndex = Math.min(skip + leads.length, totalItems);
  const totalPages = Math.ceil(totalItems / limit);

  // Handler for applying filter/sort options from Popover
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.sortField) {
      setSortBy(newFilters.sortField);
      setSortOrder(newFilters.sortOrder || "desc");
    } else {
      setSortBy("created_at");
      setSortOrder("desc");
    }
    setPage(1);
    refetch();
  };

  // Handler for resetting filter/sort options
  const handleFilterReset = () => {
    const resetFilters = {
      stage: "",
      engaged: "",
      createdAtStart: "",
      createdAtEnd: "",
      sortField: "",
      sortOrder: "desc",
    };
    setFilters(resetFilters);
    setSortBy("created_at");
    setSortOrder("desc");
    refetch();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    refetch();
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
    refetch();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Bar: Search and FilterSortPopover */}
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        {/* Search Field */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by lead’s name, email or company name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <IconButton edge="start" disabled>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{ width: "60%", mr: 2 }}
          />
        </Box>

        {/* Filter & Sort Popover */}
        <FilterSortPopover
          initialFilters={filters}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />

        <IconButton onClick={handleFilterReset} sx={{ ml: 1 }} title="Clear Filters">
          <FilterOffIcon />
        </IconButton>
      </Paper>

      {/* Info about number of leads */}
      <Typography variant="body2" sx={{ mb: 1, color: "#888" }}>
        {`Showing ${startIndex}–${endIndex} of ${totalItems} leads`}
      </Typography>

      {/* Loader Animation or Table */}
      {isLoading ? (
        <Box className="loader-box" display="flex" justifyContent="center" py={4}>
          {/* You can choose to use Lottie or MUI's CircularProgress */}
          <Lottie animationData={loaderAnimation} style={{ width: 150, height: 150 }} />
        </Box>
      ) : isError ? (
        <Typography color="error">Error loading leads.</Typography>
      ) : (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th onClick={() => setSortBy("name")} style={{ cursor: "pointer" }}>
                  Name
                </th>
                <th onClick={() => setSortBy("company")} style={{ cursor: "pointer" }}>
                  Company
                </th>
                <th>Stage</th>
                <th>Engaged</th>
                <th onClick={() => setSortBy("last_contacted")} style={{ cursor: "pointer" }}>
                  Last Contacted
                </th>
                <th onClick={() => setSortBy("created_at")} style={{ cursor: "pointer" }}>
                  Added On
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <TableRow key={lead.id} lead={lead} onEdit={onEdit} onDeleteSuccess={refetch} />
              ))}
            </tbody>
          </table>
        </Paper>
      )}

      {/* Bottom Bar: Rows per page and Pagination */}
      <Box
  mt={2}
  display="flex"
  alignItems="center"
  justifyContent="space-between"
>
  {/* Rows per page dropdown on the left */}
  <Box>
    <FormControl size="small" sx={{ width: 120 }}>
      <Select value={limit} onChange={handleLimitChange}>
        <MenuItem value={5}>5 per page</MenuItem>
        <MenuItem value={10}>10 per page</MenuItem>
        <MenuItem value={20}>20 per page</MenuItem>
      </Select>
    </FormControl>
  </Box>
  
  {/* Pagination at the center */}
  <Box flexGrow={1} display="flex" justifyContent="center" ml={-3}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
      sx={{
        "& .MuiPaginationItem-root": {
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          color: "#28272A",
          mx: 0.5,
        },
        "& .Mui-selected": {
          backgroundColor: "#6A1BE0 !important",
          color: "#fff",
        },
      }}
    />
  </Box>
</Box>

    </Box>
  );
};

export default LeadsTable;