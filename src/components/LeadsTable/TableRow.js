import React, { useState } from "react";
import { deleteLead } from "../../api/leadsApi";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { IconButton, Menu, MenuItem, Avatar, Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

/** Format a date string as "23 Jan, 2025" */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

/** Show small colored bars for the lead's stage */
function StageIcons({ stage }) {
  let bars = ["gray", "gray", "gray"];
  switch (stage) {
    case "Qualified":
      bars = ["violet", "gray", "gray"];
      break;
    case "Proposal":
      bars = ["violet", "violet", "gray"];
      break;
    case "Closed":
      bars = ["violet", "violet", "violet"];
      break;
    default:
      bars = ["gray", "gray", "gray"];
  }
  return (
    <div className="d-flex align-items-center">
      {bars.map((color, idx) => (
        <img
          key={idx}
          src={color === "violet" ? "/assets/icons/bar-violet.svg" : "/assets/icons/bar-gray.svg"}
          alt={`${color} bar`}
          style={{ width: 6, height: 18, marginRight: 1.5 }}
        />
      ))}
      <span className="ms-2" style={{ fontSize: "0.8rem", color: "#888" }}>
        {stage}
      </span>
    </div>
  );
}

/** Extract up to two initials from a lead's name */
function getNameInitials(fullName = "") {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const firstInitial = parts[0][0]?.toUpperCase() || "";
  const secondInitial = parts[1][0]?.toUpperCase() || "";
  return firstInitial + secondInitial;
}

const TableRow = ({ lead, onEdit, onDeleteSuccess }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    try {
      await deleteLead(lead.id);
      toast.error("Lead deleted successfully!");
      onDeleteSuccess();
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Error deleting lead");
    }
  };

  // Engaged badge with an icon
  const engagedBadge = lead.engaged ? (
    <span className="badge-engaged">
      <img
        src="/assets/icons/check-circle.svg"
        alt="Engaged Icon"
        style={{ width: 14, height: 14, marginRight: 4 }}
      />
      Engaged
    </span>
  ) : (
    <span className="badge-not-engaged">
      <img
        src="/assets/icons/clock.svg"
        alt="Not Engaged Icon"
        style={{ width: 14, height: 14, marginRight: 4 }}
      />
      Not Engaged
    </span>
  );

  // Prepare avatar initials
  const initials = getNameInitials(lead.name);

  return (
    <>
      <tr>
        <td>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                backgroundColor: "var(--color-brand-subtler, #F5F2FF)",
                border: "1px solid var(--color-brand-subtle, #ECE8FF)",
                color: "var(--color-brand-default, #6A1BE0)",
                width: 36,
                height: 36,
                fontSize: "1.2rem",
                mr: 1.5,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lead.name}
              </Typography>
              {lead.email && (
                <Typography variant="caption" sx={{ color: "#888" }}>
                  {lead.email}
                </Typography>
              )}
            </Box>
          </Box>
        </td>
        <td>{lead.company}</td>
        <td>
          <StageIcons stage={lead.stage} />
        </td>
        <td>{engagedBadge}</td>
        <td>{lead.last_contacted ? formatDate(lead.last_contacted) : ""}</td>
        <td>{lead.created_at ? formatDate(lead.created_at) : ""}</td>
        <td className="text-end">
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              elevation: 2,
              sx: {
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                minWidth: "180px",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                onEdit(lead);
                handleMenuClose();
              }}
              className="dot-menu-edit"
            >
              <EditIcon fontSize="small" sx={{ color: "action.active", mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowDeleteModal(true);
                handleMenuClose();
              }}
              className="dot-menu-delete"
            >
              <DeleteIcon fontSize="small" sx={{ color: "error.main", mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </td>
      </tr>

      {showDeleteModal && (
        <ConfirmDeleteModal
          message={`Are you sure you want to delete the lead "${lead.name}"?`}
          onConfirm={() => {
            handleDelete();
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default TableRow;