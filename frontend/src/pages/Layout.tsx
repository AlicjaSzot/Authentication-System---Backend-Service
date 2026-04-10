import React from "react";
import Navbar from "../components/Navbar";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <Box>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
