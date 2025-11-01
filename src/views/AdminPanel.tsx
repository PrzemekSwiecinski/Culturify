import React, { useState, useEffect } from "react";
import "../App.css";
import {
  MenuItem,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  Menu,
  Tooltip,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Dodaj organizatora", "Wyloguj"];

interface Organizer {
  id_organizatora: number;
  nazwa: string;
  telefon: string;
}

function AdminPanel() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
    null
  );
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [organizerToDeleteId, setDoctorToDeleteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    let url = "http://localhost/api/pobierz_organizatorow.php";
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);

    axios
      .get(url)
      .then((response) => {
        setOrganizers(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych lekarzy:", error);
      });
  });

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Wyloguj") {
      handleLogoutConfirm();
    } else if (setting === "Dodaj organizatora") {
      window.location.href = "/dodawanie_organizatora";
    }
  };

  const handlePagesClick = (page: string) => {
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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Usuń token z localStorage po wylogowaniu
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setIsLoggedOut(true);
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  const handleDeleteOrganizer = async (organizerId: number) => {
    try {
      const response = await axios.post(
        "http://localhost/api/usun_organizatora.php",
        {
          id: organizerId,
        }
      );

      if (response.data.message) {
        const updatedDoctors = organizers.filter(
          (organizer) => organizer.id_organizatora !== organizerId
        );
        setOrganizers(updatedDoctors);
      } else {
        console.error("Błąd usuwania:", response.data.error);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas usuwania:", error);
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseDialog = () => {
    setSelectedOrganizer(null);
  };

  return (
    <Box className="App">
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
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              ></IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handlePagesClick(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Avatar
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              alt="profile_pic"
              src="/assets/profile.jpg"
            />
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
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
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
                <Button
                  component="a"
                  href="/login"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Zaloguj
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Typography variant="h4" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Panel administratora
      </Typography>
      <Typography variant="h6" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Organizatorzy:
      </Typography>
      <Grid
        sx={{
          flexDirection: "column",
          alignContent: "center",
          marginTop: "1%",
          marginBottom: "5%",
        }}
        container
        spacing={2}
        justifyContent="center"
      >
        {organizers.map((organizer) => (
          <Grid
            sx={{ width: "100%" }}
            item
            key={organizer.id_organizatora}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
                cursor: "pointer",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{organizer.nazwa}</Typography>
                  <Typography
                    sx={{ marginTop: "10%" }}
                    variant="body1"
                    color="text.secondary"
                  >
                    {organizer.telefon}
                  </Typography>
                </Box>
                <Button
                  sx={{
                    backgroundColor: "#800000",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                    marginLeft: "auto",
                  }}
                  variant="contained"
                  onClick={() =>
                    handleDeleteOrganizer(organizer.id_organizatora)
                  }
                >
                  Usuń
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={Boolean(selectedOrganizer)}
        onClose={handleCloseDialog}
        aria-labelledby="doctor-modal"
        aria-describedby="doctor-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Typography variant="h6">{selectedOrganizer?.nazwa}</Typography>
          <Button onClick={handleCloseDialog}>Zamknij</Button>
        </Box>
      </Modal>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#800000",
          color: "white",
          textAlign: "center",
          padding: "1.5rem 0",
          bottom: 0,
          width: "100%",
          marginTop: "13%",
        }}
      >
        <Typography variant="h6">
          Culturify &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

export default AdminPanel;
