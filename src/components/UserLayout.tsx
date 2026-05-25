import React from "react";
import { Box, Container } from "@mui/material";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <UserNavbar />
      <Container maxWidth="md" sx={{ marginTop: 3, flexGrow: 1, pb: 5 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
