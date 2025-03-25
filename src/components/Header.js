// src/components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  // Get the current user info from local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {currentUser ? `Welcome, ${currentUser.name}` : "Welcome"}
        </Typography>
        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;