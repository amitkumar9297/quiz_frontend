import React, { useState } from "react";
import { motion } from 'framer-motion';
import {
  Stack,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";

interface AuthenticatedHeaderProps {
  onLogout: () => void;
}

const buttonUI = {
  whileHover: {
    scale: 1.1, 
    transition: {
      duration: 0.3, 
      ease: [0.42, 0, 0.58, 1], 
    },
  },
  whileTap: {
    scale: 0.95, 
  },
};

/**
 * A React component that displays a navigation bar for authenticated users.
 *
 * It displays 4 navigation links to the home page, quiz page, result page, and
 * leaderboard page. Additionally, it displays an avatar with a dropdown menu,
 * which allows users to navigate to their profile page or to logout.
 *
 * @function AuthenticatedHeader
 * @param {function} onLogout - A callback function that is called when the user
 * logs out.
 * @returns {ReactElement} A React element that represents the authenticated
 * header.
 */


const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
  onLogout,
}) => {
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
      <motion.div {...buttonUI}>
        <Button variant="ghost" onClick={() => navigate('/')}>
          Home
        </Button>
      </motion.div>

      <motion.div {...buttonUI}>
        <Button variant="ghost" onClick={() => navigate('/quiz')}>
          Quiz
        </Button>
      </motion.div>

      <motion.div {...buttonUI}>
        <Button variant="ghost" onClick={() => navigate('/result')}>
          Result
        </Button>
      </motion.div>

      <motion.div {...buttonUI}>
        <Button variant="ghost" onClick={() => navigate('/leaderboard')}>
          Leaderboard
        </Button>
      </motion.div>

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
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default AuthenticatedHeader;
