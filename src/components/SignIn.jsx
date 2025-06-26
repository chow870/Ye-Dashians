import '../index.css';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
  Box,
  Paper,
} from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { googleProvider, githubProvider, auth, database } from '../firebase';
import { setUser } from '../redux/slices/authSlice';
const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
function SignIn() {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [iAmAdmin, setIAmAdmin] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      const userData = {
        userEmail: email,
        userPassword: password,
      };

      const res = await fetch(`${BackendBaseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      console.log("LOGIN res ",res);
      const resp = await res.json();

      if (resp.success) {
        const user = resp.userDetails;
        dispatch(setUser(user));
        navigate('/');
      } else {
        setError('Sign-in attempt failed');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);

      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;

      const newUserData = {
        email: user.email,
        fullname: user.displayName,
        isAdmin: false,
        phoneno: user.phoneNumber,
        localUser: false,
        profileImage: user.photoURL,
      };

      const response2 = await fetch(`${BackendBaseUrl}/api/v1/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });

      if (response2.ok) {
        const responseData = await response2.json();
        if (responseData.success) {
          dispatch(setUser(responseData.data));
        }
      } else {
        console.error('Signup failed');
      }

      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setError('');
      setLoading(true);

      const result = await auth.signInWithPopup(githubProvider);
      const user = result.user;

      const res = await database.users.doc(user.uid).get();

      if (!res.exists) {
        await database.users.doc(user.uid).set({
          userId: user.uid,
          fullname: user.uid,
          profileUrl: user.photoURL,
          permLoc: '',
          curLoc: '',
          lobbies: [],
          isAdmin: false,
        });
      }

      dispatch(setUser(user));
      navigate('/');
    } catch (err) {
      console.error('GitHub sign-in error:', err);
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side Image */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
        <Box
          component="img"
          src="/yvette-de-wit-8XLapfNMW04-unsplash.jpg"
          alt="Hangout Visual"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Sign In Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            width: '100%',
            maxWidth: 420,
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              {iAmAdmin ? 'Admin Sign In' : 'Welcome Back!'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              Please enter your credentials to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{
              style: { color: '#fff', backgroundColor: '#121212' },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{
              style: { color: '#fff', backgroundColor: '#121212' },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.4,
              mt: 2,
              mb: 1,
              borderRadius: 3,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #9C27B0 30%, #7B1FA2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #6A1B9A 30%, #4A148C 90%)',
              },
            }}
          >
            Sign In
          </Button>

          {!iAmAdmin && (
            <>
              <Divider sx={{ my: 2, borderColor: '#444' }}>OR</Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={{
                  py: 1.3,
                  mb: 2,
                  borderRadius: 3,
                  borderColor: '#DB4437',
                  color: '#DB4437',
                  '&:hover': {
                    borderColor: '#C31E0F',
                    backgroundColor: 'rgba(219, 68, 55, 0.08)',
                  },
                }}
              >
                Continue with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={handleGithubSignIn}
                disabled={loading}
                sx={{
                  py: 1.3,
                  mb: 2,
                  borderRadius: 3,
                  borderColor: '#fff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Continue with GitHub
              </Button>
            </>
          )}

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2">
              <Link to="#" style={{ color: '#9575CD', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#BA68C8',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setIAmAdmin(!iAmAdmin)}
              sx={{ color: '#ccc', fontSize: '0.875rem' }}
            >
              {iAmAdmin ? 'Switch to User Login' : 'Switch to Admin Login'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default SignIn;
