import React, { useState, useEffect } from "react";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Alert
} from "@mui/material";
import { Link } from "react-router-dom";
import { storage } from "../firebase";
import signupImage from "/aleksandr-popov-JhYnL-BiP18-unsplash.jpg";

function SignUp() {
  const loads = useSelector((state) => state?.auth?.loading);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [iAmAdmin, setIAmAdmin] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [OfficeAdress, setOfficeAdress] = useState('');
  const [website, setWebsite] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleSignup = async () => {
    if (file === null && !iAmAdmin) {
      setError("Profile image toh upload karo pehle");
      setTimeout(() => setError(''), 4000);
      return;
    }

    try {
      setError('');
      setLoading(true);

      const userData = {
        email,
        fullname,
        isAdmin: iAmAdmin,
        mywebsite: website,
        officeadress: OfficeAdress,
        phoneno: phoneNo,
        password,
        confirmpassword: confirmPassword,
        localUser: true,
      };

      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Signup failed");
        setTimeout(() => setError(''), 4000);
        setLoading(false);
        return;
      }

      let userObj = responseData.data;
      if (!userObj) {
        setError(responseData.message);
        setTimeout(() => setError(''), 4000);
        setLoading(false);
        return;
      }

      let id = userObj._id;

      if (!iAmAdmin) {
        const uploadTask = storage.ref(`/users/${id}/ProfileImage`).put(file);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (err) => {
              setError(err.message);
              setTimeout(() => setError(''), 4000);
              setLoading(false);
              reject(err);
            },
            async () => {
              const url = await uploadTask.snapshot.ref.getDownloadURL();
              setImgUrl(url);

              const newuser = await fetch(`/api/v1/user/${id}`,{
          method : 'PATCH',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({profileImage:url}),
        })
        const newuserRes = await newuser.json();
        console.log(newuserRes.updatedData)
        // /dispatch(setUser(newuserRes.updatedData)); // Chow870 : updated this. i will prefer to navigate him to the login page. 
                                                        // it will logically get inclined to the widely used logic
            }
          );
        });



        
        setLoading(false);
        navigate('/signin');
        

    } catch (error) {
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Image Section */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
        <Box
          component="img"
          src="/aleksandr-popov-JhYnL-BiP18-unsplash.jpg"
          alt="Sign up visual"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Right Form Section */}
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
            maxWidth: 480,
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
              {iAmAdmin ? 'Admin Sign Up' : 'Create Account'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              Fill in the details to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{
              style: { color: '#fff', backgroundColor: '#121212' },
            }}
          />

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

          {!iAmAdmin && (
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', backgroundColor: '#121212' },
              }}
            />
          )}

          {iAmAdmin ? (
            <>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#121212' },
                }}
              />
              <TextField
                label="Office Address"
                fullWidth
                margin="normal"
                value={OfficeAdress}
                onChange={(e) => setOfficeAdress(e.target.value)}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#121212' },
                }}
              />
              <TextField
                label="Website"
                fullWidth
                margin="normal"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#121212' },
                }}
              />
            </>
          ) : (
            <Button
              component="label"
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                mb: 2,
                borderColor: '#9C27B0',
                color: '#9C27B0',
              }}
            >
              Upload Profile Image
              <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
            </Button>
          )}

          <Button
            fullWidth
            variant="contained"
            disabled={loading}
            onClick={handleSignup}
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
            Sign Up
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                to="/signin"
                style={{ color: '#BA68C8', fontWeight: 'bold', textDecoration: 'none' }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setIAmAdmin(!iAmAdmin)}
              sx={{ color: '#ccc', fontSize: '0.875rem' }}
            >
              {iAmAdmin ? 'Switch to User SignUp' : 'Switch to Admin SignUp'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default SignUp;
