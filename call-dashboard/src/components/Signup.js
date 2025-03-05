import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // For redirect after signup
import { TextField, Button, Typography, Container, Box, Snackbar, Alert, CircularProgress } from '@mui/material';

const Signup = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // For displaying errors
  const [successMessage, setSuccessMessage] = useState(null);  // For displaying success
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar visibility

  const navigate = useNavigate();  // To redirect user after successful signup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!userData.username || !userData.email || !userData.password) {
      return 'All fields are required';
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      return 'Please enter a valid email address';
    }
    if (userData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;  // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formError = validateForm();
    if (formError) {
      setError(formError);
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/signup/', userData);
      console.log(response.data);  // Log the response from the backend
      setSuccessMessage('Signup successful! Redirecting to login...');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/login');  // Redirect to the login page after a successful signup
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Sign Up
        </Typography>

        {/* Display success or error messages using Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={error ? 'error' : 'success'} onClose={() => setOpenSnackbar(false)}>
            {error || successMessage}
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            inputProps={{ minLength: 6 }}
          />

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Box>
        </form>

        <Typography variant="body2" mt={2}>
          Already have an account? <a href="/login">Login here</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
