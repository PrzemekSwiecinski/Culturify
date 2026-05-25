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
} from "@mui/material";
import { jsPDF } from "jspdf";
import UserLayout from "../components/UserLayout";

interface Ticket {
  id_biletu: string;
  id_wydarzenia: string;
  typ_wydarzenia: string;
  nazwa_wydarzenia: string;
  data: string;
  godzina: string;
}

function UsersTickets() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrUrl, setActiveQrUrl] = useState<string>("");

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleQrModalOpen = (ticketId: string) => {
    setActiveQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Culturify_Ticket_${ticketId}`,
    );
    setQrModalOpen(true);
  };

  const handleQrModalClose = () => {
    setQrModalOpen(false);
    setActiveQrUrl("");
  };

  const handleVisitClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleExhibitTicketDirect = async (ticketToExhibit: Ticket) => {
    try {
      const response = await fetch("http://localhost/api/wystaw_bilet.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_biletu: ticketToExhibit.id_biletu,
        }),
      });

      if (response.ok) {
        setTickets((prevTickets) =>
          prevTickets.filter(
            (ticket) => ticket.id_biletu !== ticketToExhibit.id_biletu,
          ),
        );
        handleModalOpen();
      } else {
        console.error("Failed to exhibit ticket");
      }
    } catch (error) {
      console.error("Error while exhibiting ticket:", error);
    }
  };

  const handleDownloadPDF = (ticket: Ticket) => {
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BILET ELEKTRONICZNY", 20, 20);

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);

    doc.text(`Wydarzenie: ${ticket.nazwa_wydarzenia}`, 20, 40);
    doc.text(`Typ: ${ticket.typ_wydarzenia}`, 20, 50);
    doc.text(`Data: ${ticket.data}`, 20, 60);
    doc.text(`Godzina: ${ticket.godzina}`, 20, 70);
    doc.text(`Identyfikator biletu: ${ticket.id_biletu}`, 20, 80);

    doc.line(20, 90, 190, 90);

    doc.setFontSize(10);
    doc.text("Generowano automatycznie przez system Culturify.", 20, 100);

    doc.save(`bilet_${ticket.id_biletu}.pdf`);
  };

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/bilety_uzytkownika.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ authToken }),
          },
        );

        if (response.ok) {
          const ticketsData = await response.json();
          setTickets(ticketsData);
        } else {
          console.error("Błąd pobierania biletów użytkownika");
        }
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania biletów:", error);
      }
    };

    if (authToken) {
      fetchUserTickets();
    }
  }, [authToken]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const renderTickets = () => {
    return tickets.map((ticket, index) => (
      <Card
        key={index}
        sx={{ marginBottom: 3 }}
        onClick={() => handleVisitClick(ticket)}
      >
        <CardContent>
          {/* Poprawiony nagłówek z datą i godziną - dodane wyśrodkowanie tekstu */}
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Data: {ticket.data}, Godzina: {ticket.godzina}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              fontWeight: 500,
              my: 1,
            }}
          >
            {ticket.typ_wydarzenia}
            {": "}
            {ticket.nazwa_wydarzenia}
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button
              sx={{
                backgroundColor: "#800000",
                "&:hover": {
                  backgroundColor: "red",
                },
                width: "25%",
              }}
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTicket(ticket);
                handleExhibitTicketDirect(ticket);
              }}
            >
              Wystaw bilet
            </Button>
            <Button
              sx={{
                backgroundColor: "#800000",
                "&:hover": {
                  backgroundColor: "red",
                },
                width: "25%",
              }}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadPDF(ticket);
              }}
            >
              Pobierz PDF
            </Button>
            <Button
              sx={{
                backgroundColor: "#800000",
                "&:hover": {
                  backgroundColor: "red",
                },
                width: "25%",
              }}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                handleQrModalOpen(ticket.id_biletu);
              }}
            >
              Kod QR
            </Button>
          </Box>
        </CardContent>
      </Card>
    ));
  };

  return (
    <UserLayout>
      <Typography variant="h5" sx={{ marginBottom: "5%", textAlign: "center" }}>
        Posiadane bilety
      </Typography>
      {tickets.length > 0 ? (
        renderTickets()
      ) : (
        <Typography variant="body1" textAlign="center">
          Brak biletów
        </Typography>
      )}

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogContent>
          <Typography variant="h6">Wystawiono bilet!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            sx={{
              backgroundColor: "#808080",
              "&:hover": {
                backgroundColor: "#808080",
              },
              mr: 4,
            }}
            variant="contained"
            autoFocus
          >
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={qrModalOpen} onClose={handleQrModalClose}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            pt: 3,
          }}
        >
          <Typography variant="h6">Twój kod QR do biletu</Typography>
          {activeQrUrl && (
            <Box
              component="img"
              src={activeQrUrl}
              alt="Kod QR bilet"
              sx={{
                width: 200,
                height: 200,
                border: "1px solid #ccc",
                padding: 1,
                backgroundColor: "#fff",
              }}
            />
          )}
          <Typography variant="body2" color="text.secondary">
            Użyj kodu podczas kontroli biletowej.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleQrModalClose}
            sx={{
              backgroundColor: "#808080",
              "&:hover": {
                backgroundColor: "#555555",
              },
              mx: "auto",
              mb: 2,
            }}
            variant="contained"
          >
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </UserLayout>
  );
}

export default UsersTickets;
