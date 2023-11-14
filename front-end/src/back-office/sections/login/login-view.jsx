import React, { useState } from "react";
import Axios from "axios";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from '../../routes/hooks';
import { bgGradient } from '../../theme/css';
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await Axios.post("http://localhost:5000/v1/users/login", { email, password }, {withCredentials:true});
  
      switch (response.status) {
        case 200:
          // Success
          const userData = response.data.user;
          const token = response.data.token;
          localStorage.setItem("jwtToken", token);
          router.push('/');
          // Display the success message from the backend
          console.log(response.data.message);
          break;
  
        case 401:
          // Invalid credentials
          setError(response.data.message);
          break;
  
        case 403:
          // User not authorized
          setError(response.data.message);
          break;
  
        default:
          // Default handling for other status codes
          // Display a generic error message from the backend
          setError(response.data.message);
          break;
      }
    } catch (error) {
      // Handle request-related errors
      if (error.response) {
        // The request was made, but the server responded with a status code different from 2xx
        setError(error.response.data.message);
      } else if (error.request) {
        // The request was made, but no response was received
        setError("No response received for the request. Please try again.");
      } else {
        // An error occurred while configuring the request
        setError("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Minimal</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          <Stack spacing={3}>
            <TextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
            <Link variant="subtitle2" underline="hover">
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleLogin}
          >
            Login
          </LoadingButton>

          {error && <p style={{ textAlign: 'center', color: '#ff0000' }}>{error}</p>}
        </Card>
      </Stack>
    </Box>
  );
}
