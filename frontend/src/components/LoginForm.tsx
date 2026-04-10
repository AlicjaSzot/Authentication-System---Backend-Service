import {
  Box,
  Button,
  TextField,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../schema/loginSchema";
import { useState } from "react";
import { CheckBox, Visibility, VisibilityOff } from "@mui/icons-material";
import ForgotPasswordModal from "./ForgotPasswordModal";
import usePasswordVisibility from "../hooks/usePasswordVisibility";

export type LoginCredentials = {
  rememberMe: any;
  email: string;
  password: string;
};

const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (data: LoginFormValues) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showPassword, togglePasswordVisibility, handleMouseDownPassword } =
    usePasswordVisibility();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="email"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            inputRef={ref}
            id="email"
            margin="normal"
            label="Adres Email"
            required
            fullWidth
            type="email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            aria-invalid={!!errors.email}
            aria-describedby="email-helper-text"
            helperText={errors.email?.message}
            FormHelperTextProps={{ id: "email-helper-text" }}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            inputRef={ref}
            id="password"
            margin="normal"
            label="Password"
            required
            fullWidth
            autoComplete="current-password"
            error={!!errors.password}
            aria-invalid={!!errors.password}
            aria-describedby="password-helper-text"
            helperText={errors.password?.message}
            FormHelperTextProps={{ id: "password-helper-text" }}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    aria-label="toggle password visibility"
                    edge="end"
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Controller
        name="rememberMe"
        control={control}
        render={({ field: { value, ...field } }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={!!value} />}
            label="Remember me"
          />
        )}
      />
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        type="submit"
        disabled={isSubmitting}
        startIcon={
          isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>

      <Box display="flex" flexDirection="column" gap={1} textAlign="center">
        <MuiLink
          component="button"
          type="button"
          variant="body2"
          onClick={() => setIsModalOpen(true)}
        >
          Forgot password?
        </MuiLink>

        <MuiLink component={Link} to="/register" variant="body2">
          Don't have an account? Register here
        </MuiLink>

        <ForgotPasswordModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default LoginForm;
