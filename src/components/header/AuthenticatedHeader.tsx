import React, { useState } from "react";
import { Stack, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router";

interface AuthenticatedHeaderProps {
  onLogout: () => void;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {/* Navigation Links */}
      <Button onClick={() => navigate("/home")}>Home</Button>
      <Button onClick={() => navigate("/quiz")}>Quiz</Button>
      <Button onClick={() => navigate("/result")}>Result</Button>
      <Button onClick={() => navigate("/leaderboard")}>Leaderboard</Button>

      {/* Avatar with Dropdown Menu */}
      <IconButton onClick={handleMenuOpen}>
        <Avatar alt="User Avatar" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          onLogout(); 
        }}>Logout</MenuItem>
      </Menu>
    </Stack>
  );
};

export default AuthenticatedHeader;
