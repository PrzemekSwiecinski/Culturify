import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { jsPDF } from "jspdf";

interface Ticket {
  id_biletu: string;
  id_wydarzenia: string;
  typ_wydarzenia: string;
  nazwa_wydarzenia: string;
  data: string;
  godzina: string;
}

const pages = ["O Nas", "Regulamin", "Kontakt"];
const settings = ["Profil", "Moje bilety", "Ryneczek Culturify", "Wyloguj"];

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
    // Generowanie pseudo kodu QR na podstawie ID biletu przy użyciu publicznego, darmowego serwisu
    setActiveQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Culturify_Ticket_${ticketId}`,
    );
    setQrModalOpen(true);
  };

  const handleQrModalClose = () => {
    setQrModalOpen(false);
    setActiveQrUrl("");
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
      } else {
        console.error("Błąd wylogowania");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas wylogowywania:", error);
    }
  };

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
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
        console.error(
          "Wystąpił błąd podczas pobierania biletów użytkownika:",
          error,
        );
      }
    };
    if (authToken) {
      fetchUserTickets();
    }
  }, [authToken]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(authToken);
  });

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
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
        const data = await response.json();
        console.log(data);

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

  const renderTickets = () => {
    return tickets.map((ticket, index) => (
      <Card
        key={index}
        sx={{ marginBottom: 3 }}
        onClick={() => handleVisitClick(ticket)}
      >
        <CardContent>
          <Typography variant="h6">
            Data: {ticket.data}, Godzina: {ticket.godzina}
          </Typography>
          <Typography variant="body1">
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
    <Box
      className="App"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
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
      <Container maxWidth="md" sx={{ marginTop: 3, flexGrow: 1 }}>
        <Typography variant="h5" sx={{ marginBottom: "5%" }}>
          Posiadane bilety
        </Typography>
        {tickets.length > 0 ? (
          renderTickets()
        ) : (
          <Typography variant="body1">Brak biletów</Typography>
        )}
      </Container>

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

      {/* Nowy Dialog wyświetlający wygenerowany kod QR */}
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

      <Box
        component="footer"
        sx={{
          backgroundColor: "#800000",
          color: "white",
          textAlign: "center",
          padding: "1.5rem 0",
          width: "100%",
          mt: "auto",
        }}
      >
        <Typography variant="h6">
          Culturify &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

export default UsersTickets;
