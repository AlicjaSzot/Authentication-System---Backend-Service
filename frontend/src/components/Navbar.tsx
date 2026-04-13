import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();

  console.log(isLoggedIn);

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/*LOGO*/}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            B2B Support
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isLoggedIn ? (
              <>
                <Button component={RouterLink} to="/login" color="inherit">
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/dashboard" color="inherit">
                  Dashboard
                </Button>
                <Button onClick={logout} variant="outlined" color="primary">
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
