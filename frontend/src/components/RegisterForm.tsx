import React from "react";
import { Controller, useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "../schema/registerSchema";
import {
  Button,
  IconButton,
  InputAdornment,
  Box,
  TextField,
} from "@mui/material";
import usePasswordVisibility from "../hooks/usePasswordVisibility";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";

const RegisterForm = ({
  onSubmit,
}: {
  onSubmit: (data: RegisterFormValues) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { showPassword, togglePasswordVisibility, handleMouseDownPassword } =
    usePasswordVisibility();
  const {
    showPassword: showConfirmPassword,
    togglePasswordVisibility: toggleConfirmPassword,
    handleMouseDownPassword: handleMouseDownConfirmPassword,
  } = usePasswordVisibility();

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            inputRef={ref}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            inputRef={ref}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
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
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
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
        name="confirmPassword"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            inputRef={ref}
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
    </Box>
  );
};

export default RegisterForm;
