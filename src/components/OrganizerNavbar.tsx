import React, { useState, useEffect } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Profil", "Moje wydarzenia", "Dodaj wydarzenia", "Wyloguj"];

export default function Navbar() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSettingsClick = (setting: string) => {
    handleCloseUserMenu();
    if (setting === "Profil") {
      window.location.href = "/profil_organizatora";
    } else if (setting === "Moje wydarzenia") {
      window.location.href = "/wydarzenia_organizatora";
    } else if (setting === "Dodaj wydarzenia") {
      window.location.href = "/dodawanie_wydarzen";
    } else if (setting === "Wyloguj") {
      handleLogoutConfirm();
    }
  };

  const handlePagesClick = (page: string) => {
    handleCloseNavMenu();
    if (page === "O Nas") {
      window.location.href = "/onas";
    } else if (page === "Regulamin") {
      window.location.href = "/regulamin";
    } else if (page === "Kontakt") {
      window.location.href = "/kontakt";
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await fetch("http://localhost/api/wyloguj.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        window.location.href = "/login";
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ marginBottom: "5%", backgroundColor: "#800000" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar
            sx={{ marginLeft: "2%", marginRight: "2%" }}
            alt="logo"
            src="/assets/logo.png"
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Culturify
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            />
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handlePagesClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginLeft: "2rem",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePagesClick(page)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  marginLeft: "1%",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {authToken ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="profile_pic" src="/assets/profile.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleSettingsClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Button component="a" href="/login" color="inherit">
                Zaloguj
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
