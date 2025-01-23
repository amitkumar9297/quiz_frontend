import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSignupUserMutation } from "../../services/api";
import { Box, Button, TextField, Typography, Stack, Alert, Container } from "@mui/material";

interface SignupFormInputs {
    name: string;
    email: string;
    password: string;
}

const signupSchema = yup.object().shape({
    name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
    email: yup.string().required("Email is required").email("Invalid email format"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [signupUser, { isLoading, isSuccess, isError, error }] = useSignupUserMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormInputs>({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        try {
            await signupUser(data).unwrap();
            alert("Signup successful!");
            navigate("/login"); 
        } catch (err) {
            console.error("Signup failed:", err);
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '2rem' }}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Signup
                </Typography>

                <Stack spacing={2} width="100%">
                    <TextField
                        label="Name"
                        variant="outlined"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                    />


                    <TextField
                        label="Email"
                        variant="outlined"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                    />


                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                    />


                    {isError && (
                        <Alert severity="error">{(error as any)?.data?.message || "Signup failed"}</Alert>
                    )}


                    {isSuccess && <Alert severity="success">Signup successful!</Alert>}


                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        fullWidth
                    >
                        {isLoading ? "Signing up..." : "Sign Up"}
                    </Button>
                </Stack>
                <Typography variant="body2" align="center" sx={{ marginTop: '1rem' }}>
                    Already have a account?{' '}
                    <a href="/login" style={{ color: 'blue' }}>Login</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Signup;
