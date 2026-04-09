import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResetPasswordValues,
  resetPasswordSchema,
} from "../schema/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetLoginPassword } from "../api/auth";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { id, token } = useParams<{ id: string; token: string }>();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!id || !token) {
    return null;
  }

  const handleSubmitResetPasswordForm = async (data: ResetPasswordValues) => {
    try {
      await ResetLoginPassword(id, token, data);
      toast.success(
        "Password reset successful! You can now log in with your new password.",
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Password reset failed:", err);
      toast.error("Password reset failed! Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Create new password
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Please enter your new password below.
        </Typography>
      </Box>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleSubmitResetPasswordForm)}
      >
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
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
              margin="normal"
              required
              fullWidth
              label="Powtórz hasło"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting ? "Saving..." : "Change password"}
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
