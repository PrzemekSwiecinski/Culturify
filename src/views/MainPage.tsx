import React, { useState, useEffect } from "react";
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
  TextField,
} from "@mui/material";
import axios from "axios";
import UserLayout from "../components/UserLayout";

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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState<number>(1);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  useEffect(() => {
    const url = "http://localhost/api/pobierz_wydarzenia.php";
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

  const handleAppointment = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Nie można kupić biletów. Brak autoryzacji.");
        return;
      }

      const appointmentData = {
        eventId: selectedEventt?.id_wydarzenia,
        authToken: token,
        ticketCount: ticketCount,
      };

      console.log("Sending appointment data:", appointmentData);

      const response = await axios.post(
        "http://localhost/api/kup_bilet.php",
        appointmentData,
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

  const handleDoctorClick = (eventt: Eventt) => {
    if (eventt && eventt.id_wydarzenia !== undefined) {
      console.log("Selected eventt id:", eventt.id_wydarzenia);
    } else {
      console.error("Nie można pobrać identyfikatora wybranego wydarzenia");
    }
    setSelectedEventt(eventt);
  };

  return (
    <UserLayout>
      <Typography
        variant="h5"
        sx={{
          marginTop: "2%",
          marginBottom: "2%",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
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

      {/* Zmieniono kontener na ułożenie pionowe (direction="column") z wyśrodkowaniem elementów */}
      <Grid
        sx={{
          alignContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "2%",
          marginBottom: "5%",
        }}
        container
        spacing={3}
        justifyContent="center"
      >
        {eventts.map((eventt) => (
          /* Zmiana szerokości elementu siatki (szerokie okna zajmujące pełną dostępną przestrzeń) */
          <Grid
            sx={{ width: "100%", maxWidth: "850px", px: 2 }}
            item
            key={eventt.id_wydarzenia}
            xs={12}
          >
            <Card
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
                cursor: "pointer",
                boxShadow: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.005)",
                  boxShadow: 4,
                },
              }}
              onClick={() => handleDoctorClick(eventt)}
            >
              <CardMedia
                sx={{ width: "250px", minWidth: "200px" }}
                component="img"
                alt={`${eventt.nazwa}`}
                height="160"
                image={`/assets/${eventt.zdjecie}`}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  pl: 3,
                }}
              >
                <Typography variant="h6" component="div">
                  {eventt.nazwa}
                  <span
                    style={{
                      marginLeft: "25px",
                      fontSize: "15px",
                      color: "gray",
                      fontWeight: 400,
                    }}
                  >
                    {eventt.data}
                  </span>
                </Typography>
                <Typography
                  sx={{ marginTop: "10px" }}
                  variant="body2"
                  color="text.secondary"
                >
                  <strong>Typ:</strong> {eventt.typ}
                </Typography>
                <Typography
                  sx={{ marginTop: "5px" }}
                  variant="body2"
                  color="text.secondary"
                >
                  <strong>Miasto:</strong> {eventt.miasto}
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
    </UserLayout>
  );
}

export default MainPage;
