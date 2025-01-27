import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useForgotPasswordMutation } from "../../services/api"; // Import your API hook

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [forgotPassword, { isLoading, isError, isSuccess }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
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
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      {isSuccess && <Typography color="success" sx={{ mt: 2 }}>Check your email for a reset link.</Typography>}
      {isError && <Typography color="error" sx={{ mt: 2 }}>Error sending reset link. Try again.</Typography>}
    </Box>
  );
};

export default ForgotPassword;
