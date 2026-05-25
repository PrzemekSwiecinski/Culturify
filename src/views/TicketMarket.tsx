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
import UserLayout from "../components/UserLayout";

interface Ticket {
  id_biletu: string;
  id_wydarzenia: string;
  id_uzytkownika: string;
  nazwa: string;
  data: string;
  godzina: string;
  cena: number;
}

function TicketMarket() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleVisitClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleBuyTicketDirect = async (ticketToBuy: Ticket) => {
    try {
      const response = await fetch("http://localhost/api/kup_z_ryneczku.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_biletu: ticketToBuy.id_biletu,
          authToken: authToken,
        }),
      });

      if (response.ok) {
        setTickets((prevTickets) =>
          prevTickets.filter(
            (ticket) => ticket.id_biletu !== ticketToBuy.id_biletu,
          ),
        );
        handleModalOpen();
      } else {
        console.error("Nie udało się kupić biletu:", response.statusText);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas kupowania biletu:", error);
    }
  };

  useEffect(() => {
    const fetchMarketTickets = async () => {
      try {
        const response = await fetch("http://localhost/api/rynek.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authToken }),
        });

        if (response.ok) {
          const ticketsData = await response.json();
          setTickets(ticketsData);
        } else {
          console.error("Błąd pobierania biletów z rynku");
        }
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas pobierania biletów z rynku:",
          error,
        );
      }
    };

    if (authToken) {
      fetchMarketTickets();
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
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Data: {ticket.data}, Godzina: {ticket.godzina}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", my: 1 }}>
            Cena: {ticket.cena}zł
            {" : "}
            {ticket.nazwa}
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
                width: "30%",
              }}
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTicket(ticket);
                handleBuyTicketDirect(ticket);
              }}
            >
              Kup bilet
            </Button>
          </Box>
        </CardContent>
      </Card>
    ));
  };

  return (
    <UserLayout>
      <Typography variant="h5" sx={{ marginBottom: "5%", textAlign: "center" }}>
        Ryneczek Culturify
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
          <Typography variant="h6">Kupiono bilet!</Typography>
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
    </UserLayout>
  );
}

export default TicketMarket;
