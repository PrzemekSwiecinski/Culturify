import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import axios from "axios";
import MainLayout from "../components/OrganizerLayout";

interface Eventt {
  id_wydarzenia: number;
  data: string;
  godzina: string;
  nazwa: string;
  opis: string;
}

function OrganizerEvents() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [eventts, setEventts] = useState<Eventt[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    id_wydarzenia: 0,
    nazwa: "",
    data: "",
    godzina: "",
    opis: "",
  });

  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDeleteEventDirect = async (eventId: number) => {
    try {
      const response = await axios.post(
        "http://localhost/api/usun_wydarzenie.php",
        { eventId },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.success) {
        setEventts((prev) =>
          prev.filter((eventt) => eventt.id_wydarzenia !== eventId),
        );
        handleDeleteModalOpen();
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas usuwania wydarzenia:", error);
    }
  };

  const handleEditClick = (eventt: Eventt) => {
    setFormData({
      id_wydarzenia: eventt.id_wydarzenia,
      nazwa: eventt.nazwa,
      data: eventt.data,
      godzina: eventt.godzina,
      opis: eventt.opis,
    });
    setEditModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/api/edycja_wydarzenia.php",
        formData,
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.success) {
        setEventts((prevEvents) =>
          prevEvents.map((eventt) =>
            eventt.id_wydarzenia === formData.id_wydarzenia
              ? { ...eventt, ...formData }
              : eventt,
          ),
        );
        handleEditModalClose();
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas edycji wydarzenia:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []); // tablica [] sprawia, że kod wykonuje się tylko RAZ, eliminując pętlę renderowania

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!authToken) return;
      try {
        const response = await fetch(
          "http://localhost/api/wydarzenia_organizatora.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authToken }),
          },
        );

        if (response.ok) {
          const eventtsData = await response.json();
          setEventts(eventtsData);
        }
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania danych:", error);
      }
    };

    fetchUserEvents();
  }, [authToken]);

  const renderEventts = () => {
    return eventts.map((eventt) => (
      <Card key={eventt.id_wydarzenia} sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Data: {eventt.data}, Godzina: {eventt.godzina}
          </Typography>
          <Typography variant="body1">Nazwa: {eventt.nazwa}</Typography>
          <Typography variant="body1">Opis: {eventt.opis}</Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(eventt);
              }}
              variant="contained"
              sx={{
                backgroundColor: "#800000",
                "&:hover": { backgroundColor: "red" },
                width: "30%",
              }}
            >
              Edytuj wydarzenie
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEventDirect(eventt.id_wydarzenia);
              }}
              variant="contained"
              sx={{
                backgroundColor: "#800000",
                "&:hover": { backgroundColor: "red" },
                width: "30%",
              }}
            >
              Usuń wydarzenie
            </Button>
          </Box>
        </CardContent>
      </Card>
    ));
  };

  return (
    <MainLayout>
      {" "}
      {/* <--- Zawijamy stronę w nasz nowy Layout */}
      <Typography variant="h5" sx={{ marginBottom: "5%" }}>
        Moje wydarzenia
      </Typography>
      {eventts.length > 0 ? (
        renderEventts()
      ) : (
        <Typography variant="body1">Brak wydarzeń</Typography>
      )}
      {/* Okienko usuwania */}
      <Dialog open={deleteModalOpen} onClose={handleDeleteModalClose}>
        <DialogContent>
          <Typography variant="h6">Wydarzenie usunięte!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteModalClose}
            sx={{
              backgroundColor: "#808080",
              "&:hover": { backgroundColor: "#808080" },
              mr: 4,
            }}
            variant="contained"
            autoFocus
          >
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
      {/* Okienko edycji */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditModalClose}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleUpdateEventSubmit}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 3 }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Edytuj wydarzenie
            </Typography>
            <TextField
              label="Nazwa wydarzenia"
              name="nazwa"
              value={formData.nazwa}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Data (np. 10.09.2026)"
              name="data"
              value={formData.data}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Godzina (np. 20:00)"
              name="godzina"
              value={formData.godzina}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Opis"
              name="opis"
              value={formData.opis}
              onChange={handleFormChange}
              fullWidth
              required
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#800000",
                "&:hover": { backgroundColor: "red" },
              }}
            >
              Zapisz zmiany
            </Button>
            <Button
              onClick={handleEditModalClose}
              variant="contained"
              sx={{
                backgroundColor: "#808080",
                "&:hover": { backgroundColor: "#666666" },
              }}
            >
              Anuluj
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainLayout>
  );
}

export default OrganizerEvents;
