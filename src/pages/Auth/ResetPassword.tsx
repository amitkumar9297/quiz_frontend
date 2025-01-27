import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useResetPasswordMutation } from "../../services/api"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useNavigate, useSearchParams } from "react-router-dom";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  token: yup.string().required("Token is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

interface ResetPasswordFormValues {
  email: string;
  token: string;
  newPassword: string;
}

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

  const token = searchParams.get("token"); 
  const [resetPassword, { isLoading, isError, isSuccess }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    try {
      await resetPassword(data).unwrap();
      toast.success("Password reset successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          fullWidth
          label="Reset Token"
          variant="outlined"
          margin="normal"
          value={token}
          disabled
          {...register("token")}
          error={!!errors.token}
          helperText={errors.token?.message}
        />
        <TextField
          fullWidth
          type="password"
          label="New Password"
          variant="outlined"
          margin="normal"
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
      {isSuccess && <Typography color="success" sx={{ mt: 2 }}>Password reset successfully.</Typography>}
      {isError && <Typography color="error" sx={{ mt: 2 }}>Error resetting password. Try again.</Typography>}
    </Box>
  );
};

export default ResetPassword;
