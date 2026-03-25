import React from "react";
import {
  AppBar, Toolbar, Typography, Button, Avatar,
  Box, IconButton, Tooltip,
} from "@mui/material";
import { AutoAwesome, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #F0F0F5",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ maxWidth: 680, width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          <AutoAwesome sx={{ color: "primary.main", fontSize: 22 }} />
          <Typography variant="h6" sx={{ background: "linear-gradient(135deg,#6C63FF,#FF6584)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
            Vibe
          </Typography>
        </Box>

        {user ? (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 14, fontWeight: 700 }}
            >
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
              {user.username}
            </Typography>
            <Tooltip title="Logout">
              <IconButton size="small" onClick={handleLogout} sx={{ color: "text.secondary" }}>
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button variant="text" onClick={() => navigate("/login")}>Log in</Button>
            <Button variant="contained" onClick={() => navigate("/signup")}>Sign up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;