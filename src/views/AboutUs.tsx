import React, { useState, useEffect } from "react";
import "../App.css";
import { Typography, Box } from "@mui/material";
import UserLayout from "../components/UserLayout";

function AboutUs() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  return (
    <UserLayout>
      <Box
        sx={{
          textAlign: "left",
          marginTop: "5%",
          marginBottom: "7%",
          paddingX: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}
        >
          O Nas
        </Typography>

        <Typography
          variant="h6"
          paragraph
          sx={{ marginTop: "5%", lineHeight: 1.8 }}
        >
          Witaj na stronie Culturify! Jesteśmy platformą wydarzeniową,
          działającą od 2020 roku, która umożliwia organizatorom łatwe i wygodne
          wstawianie wydarzeń, a użytkownikom kupowanie biletów online.
        </Typography>

        <Typography variant="h6" paragraph sx={{ lineHeight: 1.8 }}>
          Naszym celem jest zapewnienie szybkiego dostępu to różnorodnych
          wydarzeń kulturalnych, artystycznych i rozrywkowych. Współpracujemy z
          doświadczonymi organizatorami w różnych dziedzinach, aby zapewnić
          bogatą ofertę wydarzeń.
        </Typography>

        <Typography variant="h6" paragraph sx={{ lineHeight: 1.8 }}>
          Nasza platforma umożliwia łatwe wyszukiwanie wydarzeń, kupowanie
          biletów, a także skuteczną komunikację między organizatorami a
          uczestnikami. Jesteśmy dumni z zespołu świetnych organizatorów, którzy
          są gotowi dostarczyć Ci niezapomnianych wrażeń.
        </Typography>

        <Typography variant="h6" paragraph sx={{ lineHeight: 1.8 }}>
          Dziękujemy, że jesteś z nami i pozwól nam umilić Twoje chwile. Jeśli
          masz pytania lub sugestie, skontaktuj się z nami.
        </Typography>
      </Box>
    </UserLayout>
  );
}

export default AboutUs;
