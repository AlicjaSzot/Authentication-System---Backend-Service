import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResetPasswordValues,
  resetPasswordSchema,
} from "../schema/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetLoginPassword } from "../api/auth";
import toast from "react-hot-toast";
import usePasswordVisibility from "../hooks/usePasswordVisibility";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPasswordPage = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
  const navigate = useNavigate();

  const {
    showPassword: showNewPassword,
    togglePasswordVisibility: toggleNewPasswordVisibility,
    handleMouseDownPassword: handleMouseDownNewPassword,
  } = usePasswordVisibility();

  const {
    showPassword: showConfirmPassword,
    togglePasswordVisibility: toggleConfirmPasswordVisibility,
    handleMouseDownPassword: handleMouseDownConfirmPassword,
  } = usePasswordVisibility();

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
      navigate("/login");
    } catch (err) {
      console.error("Password reset failed:", err);
      const error = err as any;
      if (error.response?.status < 500) {
        toast.error(
          error.response?.data?.error ||
            "Password reset failed! Please try again.",
        );
      }
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
              type={showNewPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleNewPasswordVisibility}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
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
              margin="normal"
              required
              fullWidth
              label="Confirm new password"
              type={showConfirmPassword ? "text" : "password"}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleConfirmPasswordVisibility}
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
