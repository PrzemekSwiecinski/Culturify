import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
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
  );
}
