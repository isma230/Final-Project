import React, { useState } from "react";
import { useQueryClient } from "react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../components/iconify";
import { useRouter } from "../../routes/hooks";
import { bgGradient } from "../../theme/css";

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const config = {
          withCredentials: true
        }
      const response = await axios.post(
        "http://localhost:5000/v1/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
        config
      );
      // Invalidate and refetch any queries that depend on user data
      queryClient.invalidateQueries("userData");

      toast.success("Login successful!");

      setTimeout(() => {
        // Navigate to the dashboard
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };



  const renderForm = (
    <Stack spacing={3}>
      <TextField
        name="email"
        label="Email address"
        type="email"
        onChange={handleChange}
        required
      />
      <TextField
        name="password"
        label="Password"
        onChange={handleChange}
        type={showPassword ? "text" : "password"}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                <Iconify
                  icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={(e) => handleLogin(e)}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg",
        }),
        height: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Toaster />
      <Paper sx={{ p: 5, width: 1, maxWidth: 420 }}>{renderForm}</Paper>

      </Box>
  );
}