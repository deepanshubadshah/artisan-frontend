// src/components/Pagination.js
import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { styled } from "@mui/material/styles";

// Example custom styling using MUI's styled API
const StyledPagination = styled(Pagination)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiPaginationItem-root": {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    color: "#28272A", // text color
    borderRadius: 8,
    margin: "0 4px",
    minWidth: 32,
    height: 32,
  },
  "& .Mui-selected": {
    backgroundColor: "#6A1BE0 !important", // Figma's brand color
    color: "#fff",
  },
}));

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const handleChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <StyledPagination
      page={currentPage}
      count={totalPages}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
      renderItem={(item) => (
        <PaginationItem {...item} />
      )}
    />
  );
}
