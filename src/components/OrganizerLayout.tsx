import React from "react";
import { Box, Container } from "@mui/material";
import Navbar from "./OrganizerNavbar";
import Footer from "./Footer";

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

export default function OrganizerLayout({ children }: OrganizerLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ marginTop: 3, flexGrow: 1, pb: 5 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
