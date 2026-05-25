import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import UserLayout from "../components/UserLayout";

interface UserData {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  pesel: string;
  portfel: number;
}

function UserView() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleDoladuj = async () => {
    if (!authToken) return;
    try {
      const response = await fetch("http://localhost/api/doladuj.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authToken }),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        if (updatedUserData && !updatedUserData.error) {
          setUserData(updatedUserData);
        } else {
          console.error("Błąd z API:", updatedUserData.error);
        }
      } else {
        console.error("Błąd doładowania portfela");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas doładowania portfela:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/api/pobierz_dane_uzytkownika.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ authToken }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            setUserData(data);
          } else {
            console.error("Błąd z API:", data.error);
          }
        } else {
          console.error("Błąd pobierania danych użytkownika");
        }
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas pobierania danych użytkownika:",
          error,
        );
      }
    };

    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  return (
    <UserLayout>
      <Card
        sx={{
          maxWidth: 300,
          margin: "auto",
          marginBottom: "9%",
          marginTop: "8%",
        }}
      >
        <Avatar
          alt="User Avatar"
          src="/assets/profile.jpg" // <--- Poprawiona ścieżka bezwzględna (dodany /)
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            marginTop: "10%",
            marginBottom: "10%",
          }}
        />
        <CardContent>
          {userData ? (
            <Box
              sx={{
                marginTop: "5%",
                marginBottom: "5%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: "5%",
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: "10%" }}>
                {userData.imie} {userData.nazwisko}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                <strong>Email:</strong> {userData.email}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                <strong>Numer telefonu:</strong> {userData.telefon}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                <strong>PESEL:</strong> {userData.pesel}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "3%" }}>
                <strong>Saldo:</strong> {userData.portfel} zł
              </Typography>
              <Button
                sx={{
                  backgroundColor: "#800000",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                  mb: 2,
                  mt: 2,
                }}
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleDoladuj}
              >
                Doładuj
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" textAlign="center">
              Ładowanie danych...
            </Typography>
          )}
        </CardContent>
      </Card>
    </UserLayout>
  );
}

export default UserView;
