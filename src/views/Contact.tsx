import React, { useState, useEffect } from "react";
import "../App.css";
import { Typography, Box } from "@mui/material";
import UserLayout from "../components/UserLayout";

function Contact() {
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
          Kontakt
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{ marginTop: "5%", lineHeight: 1.8 }}
        >
          Culturify Sp. z o.o. <br />
          ul. Wiejska 10
          <br />
          15-308 Białystok
          <br />
          Polska
          <br />
          NIP: 0000000000
          <br />
          KRS: 0000000000
          <br />
          REGON: 000000
          <br />
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "6%" }}
          fontWeight="bold"
          gutterBottom
          paragraph
        >
          Kontakt do supportu:
          <br />
        </Typography>
        <Typography variant="h6" paragraph sx={{ lineHeight: 1.8 }}>
          Email: support.culturify@gmail.pl <br />
          Infolinia: 678123610
        </Typography>
      </Box>
    </UserLayout>
  );
}

export default Contact;
