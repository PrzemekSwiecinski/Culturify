import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import "../App.css";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Menu,
  Tooltip,
  TextField,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Profil", "Moje bilety", "Ryneczek Culturify", "Wyloguj"];

interface Eventt {
  id_wydarzenia: number;
  id_organizatora: string;
  typ: string;
  nazwa: string;
  data: string;
  godzina: string;
  miasto: string;
  adres: string;
  opis: string;
  zdjecie: string;
  cena: number;
}

function MainPage() {
  const [eventts, setEventts] = useState<Eventt[]>([]);
  const [selectedEventt, setSelectedEventt] = useState<Eventt | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState<number>(1);

  useEffect(() => {
    let url = "http://localhost/api/pobierz_wydarzenia.php";
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);

    const params = new URLSearchParams();
    if (selectedType) {
      params.append("typ", selectedType);
    }
    if (selectedCity) {
      params.append("miasto", selectedCity);
    }

    axios
      .get(url, { params })
      .then((response) => {
        setEventts(response.data);
      })
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
      });
  }, [selectedType, selectedCity]);

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Profil") {
      window.location.href = "/profil_uzytkownika";
    } else if (setting === "Moje bilety") {
      window.location.href = "/bilety_uzytkownika";
    } else if (setting === "Ryneczek Culturify") {
      window.location.href = "/rynek_biletow";
    } else if (setting === "Wyloguj") {
      handleLogoutConfirm();
    } else {
      handleCloseUserMenu();
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

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleAppointment = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.error("Nie można kupić biletów. Brak autoryzacji.");
        return;
      }

      const appointmentData = {
        eventId: selectedEventt?.id_wydarzenia,
        authToken: authToken,
        ticketCount: ticketCount,
      };

      console.log("Sending appointment data:", appointmentData); // Dodaj to

      const response = await axios.post(
        "http://localhost/api/kup_bilet.php",
        appointmentData
      );

      if (response.status === 200) {
        console.log("Bilety zostały kupione pomyślnie!");
        setIsAppointmentSuccess(true);
      } else {
        console.error("Wystąpił problem podczas kupowania biletów.");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas kupowania biletów:", error);
    }
  };

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

  const handleDoctorClick = (eventt: Eventt) => {
    if (eventt && eventt.id_wydarzenia !== undefined) {
      console.log("Selected eventt id:", eventt.id_wydarzenia);
    } else {
      console.error("Nie można pobrać identyfikatora wybranego lekarza");
    }
    setSelectedEventt(eventt);
  };

  const handleCloseDialog = () => {
    setSelectedEventt(null);
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
              sx={{ marginLeft: "8%", marginRight: "2%" }}
              alt="logo"
              src="/assets/logo.png"
            />
            <Typography
              variant="h6"
              noWrap
              href="/"
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
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
                <Button component="a" href="/rejestracja" color="inherit">
                  Zarejestruj
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Typography variant="h5" sx={{ marginTop: "2%", marginBottom: "2%" }}>
        Wybierz wydarzenie
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <FormControl variant="outlined" sx={{ width: "50%" }}>
            <InputLabel>Rodzaj wydarzenia</InputLabel>
            <Select
              value={selectedType || ""}
              onChange={(e) => setSelectedType(e.target.value as string)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value="Mecz">Mecz</MenuItem>
              <MenuItem value="Koncert">Koncerty</MenuItem>
              <MenuItem value="Festiwal">Festiwale</MenuItem>
              <MenuItem value="Wydarzenie charytatywne">
                Wydarzenia charytatywna
              </MenuItem>
              <MenuItem value="Wystawy i targi">Wystawy i targi</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Miasto</InputLabel>
            <Select
              sx={{ width: "50%" }}
              value={selectedCity || ""}
              onChange={(e) => setSelectedCity(e.target.value as string)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value="Białystok">Białystok</MenuItem>
              <MenuItem value="Suwałki">Suwałki</MenuItem>
              <MenuItem value="Łomża">Łomża</MenuItem>
              <MenuItem value="Augustów">Augustów</MenuItem>
              <MenuItem value="Warszawa">Warszawa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        sx={{
          marginLeft: "-5%",
          alignContent: "center",
          flexDirection: "column",
          marginTop: "1%",
          marginBottom: "5%",
        }}
        container
        spacing={2}
        justifyContent="center"
      >
        {eventts.map((eventt) => (
          <Grid
            sx={{ width: "100%" }}
            item
            key={eventt.id_wydarzenia}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Card
              sx={{
                width: "140%",
                display: "flex",
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => handleDoctorClick(eventt)}
            >
              <CardMedia
                sx={{ width: "30%" }}
                component="img"
                alt={`${eventt.nazwa}`}
                height="150"
                image={`/assets/${eventt.zdjecie}`}
              />
              <CardContent>
                <Typography variant="subtitle1">
                  <span style={{ marginLeft: "30px" }}></span>
                  {eventt.nazwa}
                  <span style={{ marginLeft: "18px" }}>{eventt.data}</span>
                </Typography>
                <Typography
                  sx={{ marginTop: "5%" }}
                  variant="body1"
                  color="text.secondary"
                >
                  {eventt.typ}
                </Typography>
                <Typography
                  sx={{ marginTop: "5%" }}
                  variant="body1"
                  color="text.secondary"
                >
                  {eventt.miasto}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={!!selectedEventt} onClose={() => setSelectedEventt(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {selectedEventt?.nazwa}
          </Typography>
          <Typography sx={{ mt: 2 }}>{selectedEventt?.opis}</Typography>
          <Typography sx={{ mt: 2 }}>Cena: {selectedEventt?.cena}zł</Typography>
          <TextField
            label="Liczba biletów"
            type="number"
            value={ticketCount}
            onChange={(e) => setTicketCount(parseInt(e.target.value))}
            sx={{ mt: 2, mb: 2 }}
            inputProps={{ min: 1 }}
            fullWidth
          />
          <Button
            sx={{
              backgroundColor: "#800000",
              "&:hover": {
                backgroundColor: "red",
              },
              mr: "49%",
            }}
            variant="contained"
            color="primary"
            onClick={handleAppointment}
          >
            Kup bilet
          </Button>
          <Button
            sx={{
              backgroundColor: "#808080",
              "&:hover": {
                backgroundColor: "#808080",
              },
            }}
            variant="contained"
            onClick={() => setSelectedEventt(null)}
          >
            Zamknij
          </Button>
        </Box>
      </Modal>

      <Modal
        open={isAppointmentSuccess}
        onClose={() => setIsAppointmentSuccess(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Sukces!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Bilety zostały kupione pomyślnie.
          </Typography>
          <Button
            sx={{
              backgroundColor: "#808080",
              "&:hover": {
                backgroundColor: "#808080",
              },
            }}
            variant="contained"
            color="primary"
            onClick={() => setIsAppointmentSuccess(false)}
          >
            Zamknij
          </Button>
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
        }}
      >
        <Typography variant="h6">
          Culturify &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

export default MainPage;
