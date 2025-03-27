// src/pages/LeadsPage.js
import React, { useState } from "react";
import LeadsTable from "../components/LeadsTable/LeadsTable";
import AddLeadModal from "../components/AddLeadModal";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "../hooks/useWebSocket";
import { exportLeads } from "../api/leadsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

// Function to pick a background color based on the user's name
const getAvatarColor = (name) => {
  const colors = ["#7f56da", "#6366f1", "#a78bfa", "#4f46e5", "#10b981", "#f59e0b"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const LeadsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Retrieve current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Profile menu state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const handleProfileClick = (e) => {
    setProfileAnchorEl(e.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // WebSocket: Handle incoming notifications and update leads table
  useWebSocket({
    onMessage: (rawData) => {
      console.log("Raw WebSocket data:", rawData);
      const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      console.log("Parsed WebSocket data:", data);
      const isOwnAction = currentUser && currentUser.id === data.source;
      if (!isOwnAction) {
        if (data.event === "lead_created") {
          toast.success(`${data.sourceName} added a new lead.`);
        } else if (data.event === "lead_updated") {
          toast.info(`${data.sourceName} updated a lead.`);
        } else if (data.event === "lead_deleted") {
          toast.warn(`${data.sourceName} deleted a lead.`);
        }
      }
      queryClient.invalidateQueries(["leads"]);
    },
  });

  // Open modal for adding a new lead
  const handleAddLead = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  // Handle export from the top bar
  const handleExport = async () => {
    try {
      const blob = await exportLeads();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export initiated!");
    } catch (error) {
      console.error("Error exporting leads:", error);
      toast.error("Error exporting leads");
    }
  };

  // Open modal for editing an existing lead
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container py-4">
      {/* Top Bar: Heading, Profile, and Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold">Leads</h1>
        <div className="btn-group d-flex align-items-center gap-2">
          {currentUser && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle1">
                Hi, {currentUser.name.trim().split(" ")[0]}
              </Typography>
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(currentUser.name),
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                }}
                onClick={handleProfileClick}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{currentUser.name}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
          <button
            className="btn-add-lead d-flex align-items-center me-2"
            onClick={handleAddLead}
          >
            <img
              src="/assets/icons/plus.svg"
              alt="Add Lead"
              className="me-2"
              style={{ width: "16px", height: "16px" }}
            />
            Add Lead
          </button>
          <button
            className="btn-export d-flex align-items-center"
            onClick={handleExport}
          >
            <img
              src="/assets/icons/download.svg"
              alt="Export All"
              className="me-2"
              style={{ width: "18px", height: "18px" }}
            />
            Export All
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <LeadsTable onEdit={handleEditLead} />

      {/* Modal for Adding/Editing Lead */}
      {isModalOpen && (
        <AddLeadModal
          existingLead={editingLead}
          onClose={handleCloseModal}
          onSuccess={() => queryClient.invalidateQueries(["leads"])}
        />
      )}
    </div>
  );
};

export default LeadsPage;