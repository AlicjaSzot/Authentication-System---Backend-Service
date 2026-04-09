import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { api } from "../api/axiosClient";
import { set } from "zod";
import { toast } from "react-hot-toast";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ open, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSent, setIsFormSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/forgot-password", { email });

      setIsFormSent(true);
      setEmail("");
    } catch (err) {
      console.error("Error during forgot password request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        {isFormSent ? (
          <>
            <DialogTitle>Check your inbox</DialogTitle>
            <DialogContent>
              <DialogContentText>
                If this email address has been registered with us, you will
                receive a link to reset your password.
              </DialogContentText>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent>
              <DialogContentText mb={2}>
                If this email address has been registered with us, you will
                receive a link to reset your password.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color="primary"
              >
                Remind password
              </Button>
            </DialogActions>
          </>
        )}
      </form>
    </Dialog>
  );
};

export default ForgotPasswordModal;
