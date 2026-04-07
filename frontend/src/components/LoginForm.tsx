import { Box, Button, TextField, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../schema/loginSchema";

export type LoginCredentials = {
  email: string;
  password: string;
};

const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (data: LoginCredentials) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        margin="normal"
        label="Adres Email"
        required
        fullWidth
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
      />
      <TextField
        margin="normal"
        label="Password"
        required
        fullWidth
        type="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
      />
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        type="submit"
        disabled={isSubmitting}
      >
        Log in
      </Button>

      <Box textAlign="center">
        <MuiLink component={Link} to="/register">
          Don't have an account? Register here
        </MuiLink>
      </Box>
    </Box>
  );
};

export default LoginForm;
