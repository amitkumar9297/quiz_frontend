import React, { useContext } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { ThemeContext } from "../../ThemeContext";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/reducers/authReducer";
import AuthenticatedHeader from "./AuthenticatedHeader";
import logo from "../../../public/logo.webp";

/**
 * A React component that displays a header with a logo, a title, and a button to either
 * login or logout.
 *
 * It uses the ThemeContext to toggle the theme of the header and the button.
 *
 * If the user is authenticated, it displays an AuthenticatedHeader component with a logout
 * button. Otherwise, it displays a login button.
 *
 * @returns A JSX element that represents the header.
 */
const Header: React.FC = () => {
  const navigation = useNavigate();
  const themeContext = useContext(ThemeContext);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeContextProvider");
  }

  const { toggleTheme, mode } = themeContext;

  const handleLogout = () => {
    dispatch(logout());
    navigation("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "30px",
        padding: "10px 20px",
        background: mode === "light" ? "#ffffff" : "#1e1e1e",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <img
          src={logo}
          alt="Logo"
          width={40}
          height={40}
          style={{ borderRadius: "50%" }}
        />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          fontSize={"1.5rem"}
          fontWeight={"bold"}
        >
          Quiz App
        </Typography>
      </Stack>
      {isAuthenticated ? (
        <AuthenticatedHeader onLogout={handleLogout} />
      ) : (
        <Button variant="outlined" onClick={() => navigation("/login")}>
          Login
        </Button>
      )}
    </header>
  );
};

export default Header;
