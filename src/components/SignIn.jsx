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
  Container,
  Paper
} from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { setAdminFalse, setAdminTrue } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { googleProvider, githubProvider, auth, database } from '../firebase';
import { setUser } from '../redux/slices/authSlice';

function SignIn() {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [myUser, setMyUser] = useState(null);
  const [iAmAdmin, setIAmAdmin] = useState(false);
  const navigate = useNavigate();

  // Login handlers remain the same
  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      
      const userData = {
        userEmail: email,
        userPassword: password
      };

      let res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),  
      });

      let resp = await res.json();

      if(resp) {
        let user = resp.userDetails;
        dispatch(setUser(user));
      } else {
        setError("Sign-in attempt failed");
        setTimeout(() => {
          setError('');
        }, 4000);
      }

      setLoading(false);
      navigate('/');
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setTimeout(() => {
        setError('');
      }, 4000);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Original Google sign-in logic remains unchanged
    try {
      setError('');
      setLoading(true);
      const result = await auth.signInWithPopup(googleProvider);
      
      const user = result.user;
      const userEmail = user.email;
      
      const newUserData = {
        email: userEmail,
        fullname: user.displayName,
        isAdmin: false, 
        phoneno: user.phoneNumber,
        localUser: false,
        profileImage: user.photoURL
      };

      const response2 = await fetch("/api/v1/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
      
      if (!response2.ok) {
        console.error("Signup failed");
        return;
      } else {
        console.log("Signup successful:");    
      
        const responseData = await response2.json();
        if(responseData.success) {
          let dbUser = responseData.data;
          dispatch(setUser(dbUser));
        }
      }  
      navigate('/');
      setLoading(false);       
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
      setTimeout(() => setError(''), 4000);
      setLoading(false);
    }
  };

  const handleGithubSignIn = async() => {
    // Original GitHub sign-in logic remains unchanged
    try {
      setError('');
      setLoading(true);
      const result = await auth.signInWithPopup(githubProvider);
      const user = result.user;
      setMyUser(user);

      const res = await database.users.doc(user.uid).get();
      if(!res.exists) {
        await database.users.doc(user.uid).set({
          userId: user.uid,
          fullname: user.uid,
          profileUrl: user.photoURL,
          permLoc: "",
          curLoc: "",
          lobbies: [],
          isAdmin: false
        });
      }

      dispatch(setUser(user));
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setError(error.message);
      setTimeout(() => setError(''), 4000);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate('/');
    }
  }, [user]);

  // Improved UI design
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Section - Branding */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexDirection: 'column',
          p: 5,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          HangoutSpot
        </Typography>
        <Typography variant="h6" textAlign="center" maxWidth="400px">
          Discover new people and meet up at cool spots around you!
        </Typography>
      </Box>
  
      {/* Right Section - SignIn Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 420 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              {iAmAdmin ? 'Admin Sign In' : 'Welcome Back!'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565C0 30%, #0D47A1 90%)',
              },
            }}
          >
            Sign In
          </Button>
  
          {!iAmAdmin && (
            <>
              <Divider sx={{ my: 2 }}>OR</Divider>
  
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
                    backgroundColor: 'rgba(219, 68, 55, 0.04)',
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
                  borderColor: '#333',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#000',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Continue with GitHub
              </Button>
            </>
          )}
  
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2">
              <Link to="#" style={{ color: '#2196F3', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Typography>
          </Box>
  
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}
              <Link to="/signup" style={{ color: '#2196F3', fontWeight: 'bold', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
  
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setIAmAdmin(!iAmAdmin)}
              sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
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