import React, { useState, useEffect } from "react";
import "../App.css";
import { Typography, Box } from "@mui/material";
import UserLayout from "../components/UserLayout";

function TermsAndConditions() {
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
          marginBottom: "5%",
          paddingX: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}
        >
          Regulamin
        </Typography>

        <Typography
          variant="h5"
          sx={{ marginTop: "4%", fontWeight: 600 }}
          paragraph
        >
          §1. Postanowienia ogólne
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.8 }}>
          a. Usługi – mają znaczenie nadane w dalszej części Regulaminu.
          <br />
          b. Serwis – serwis internetowy prowadzony przez Usługodawcę pod
          adresem: ...
          <br />
          c. Regulamin – niniejszy regulamin świadczenia usług drogą
          elektroniczną przez Usługodawcę.
          <br />
          d. Użytkownik – osoba fizyczna, posiadająca pełną zdolność do
          czynności prawnych, która dokonała Rejestracji w Serwisie i nabyła
          bilet na wydarzenie.
          <br />
          e. Organizator – osoba fizyczna lub prawna, która zamieszcza w
          Serwisie informacje o organizowanych przez siebie wydarzeniach.
          <br />
          f. Profil – zbiór informacji na temat Organizatora umieszczony w
          Serwisie w postaci podstrony Serwisu posiadającej unikalny adres URL.
          <br />
          g. Rejestracja – proces utworzenia Konta Użytkownika lub Konta
          Organizatora.
        </Typography>

        <Typography
          variant="h5"
          sx={{ marginTop: "4%", fontWeight: 600 }}
          paragraph
        >
          §2. Rodzaje i zakres Usług
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.8 }}>
          1. Usługodawca świadczy dla Użytkowników między innymi następujące
          Usługi:
        </Typography>
        <Typography sx={{ marginLeft: "3%", lineHeight: 1.8 }} paragraph>
          a. udostępnia wyszukiwarkę wydarzeń;
          <br />
          b. umożliwia Użytkownikom zakup biletów na wydarzenia;
          <br />
          c. umożliwia Użytkownikom prowadzenie za pośrednictwem aplikacji
          mobilnej dialogu z Organizatorami, którzy udostępnili taką możliwość;
          <br />
          d. umożliwia zamieszczanie informacji o wydarzeniach przez
          Organizatorów.
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.8 }}>
          2. Usługi dla Użytkowników oraz usługi Profilu podstawowego są
          nieodpłatne.
        </Typography>

        <Typography
          variant="h5"
          sx={{ marginTop: "4%", fontWeight: 600 }}
          paragraph
        >
          §3. Warunki świadczenia Usług dla Użytkowników
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.8 }}>
          1. W celu korzystania z Usług, Użytkownik:
        </Typography>
        <Typography sx={{ marginLeft: "3%", lineHeight: 1.8 }} paragraph>
          a. musi dokonać Rejestracji,
          <br />
          b. musi posiadać dostęp do sieci Internet,
          <br />
          c. musi posiadać przeglądarkę internetową (jedną z następujących):
          Firefox, Chrome, Safari, IE, Opera, zaktualizowaną do najnowszej
          wersji.
        </Typography>
        <Typography paragraph sx={{ lineHeight: 1.8 }}>
          2. Każdy korzystający z Internetu może zapoznawać się z informacjami o
          wydarzeniach i Organizatorach oraz korzystać z wyszukiwarki.
        </Typography>
      </Box>
    </UserLayout>
  );
}

export default TermsAndConditions;
