import React, { useState, useEffect } from "react";
// import { isLoaded } from 'react-redux-firebase'
// import { connect } from "react-redux";
// import * as authActions from '../../actions/authActions';
import { signup } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Alert from '@mui/material/Alert';
import { TextField } from '@mui/material';
import { Link } from "react-router-dom";
import {  database , storage } from "../firebase";





function SignUp(props) {
  const loads = useSelector((state) => {
    return state.auth.loading;
  })
  const user = useSelector((state) => {
    return state?.auth?.user?.uid
  })





  const dispatch = useDispatch();


  let navigate = useNavigate()




  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  // never give the default value of a file type as string , it would result in errors
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adress, setAdress] = useState('')



  // dispatch(signup({ email, password }));
  const handleSignup = async () => {
    if (file === null) {
        setError("Profile image toh upload karo pehle");
        setTimeout(() => {
            setError('');
        }, 4000);
        return;
    }

    try {
        setError('');
        setLoading(true);
        let userObj = await dispatch(signup({ email, password }));
        if(!userObj.payload.uid)
        {
          // console.log(userObj.payload)
          setError(userObj.payload)
          setTimeout(() => {
            setError('')
        }, 4000);
        setLoading(false)
          return;
        }
        console.log("userobj is" , userObj.payload.uid)
        let uid = userObj.payload.uid;
        console.log(uid);

        const uploadTask = storage.ref(`/users/${uid}/ProfileImage`).put(file);
        uploadTask.on('state_changed', fn1, fn2, fn3);

        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`upload is ${progress}% done.`);
        }

        function fn2(err) {
            console.log(err.message);
            setError(err.message);
            setTimeout(() => {
                setError('');
            }, 4000);
            setLoading(false);
        }

        function fn3() {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                console.log(url);
                
                database.users.doc(uid).set({
                    email: email,
                    userId: uid,
                    fullname: fullname,
                    profileUrl: url,
                    permLoc : adress,
                    curLoc : adress,
                    lobbies : []
                });
            });
            setLoading(false);
            navigate('/');
        }
    } catch (error) {
        console.log(error.message);
        setError(error.message);
        setTimeout(() => {
            setError('');
        }, 4000);
        setLoading(false);
    }
};









  useEffect(() => {
    if (user != null) {
      navigate('/')
    }
  }, [user])







  return (
    <>
      {/* To save from multiple request */}
      {/* {!isLoaded(props.auth)?<></>:<>*/}
      {loads ? <h4 style={{ marginTop: '10%', height: '52vh' }}>Patiently Wait...we are resgistering you in</h4> :
        <div>
          <div className='signupWrapper'>
            <div className='signupCard'>
              <Card sx={{ width: '25vw' }} variant="outlined">


                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',  // Note: alignItems 'space-around' is not a valid value, so I used 'center'
                  textAlign: 'center'
                }}> <CardActionArea >
                    <Typography component="div">
                      Lizard
                    </Typography></CardActionArea>
                  <TextField id="outlined-basic" label="Email" variant="outlined" margin="normal" size="small" value={email} onChange={(e) => {
                    setEmail(e.target.value);
                  }} />
                  <TextField id="outlined-basic" label="Password" variant="outlined" margin="normal" size="small" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                  }} />
                  <TextField id="outlined-basic" label="Full-Name" variant="outlined" margin="normal" size="small" value={fullname} onChange={(e) => {
                    setFullname(e.target.value);
                  }} />
                  <TextField id="outlined-basic" label="Your Adress" variant="outlined" margin="normal" size="small" value={adress} onChange={(e) => {
                    setAdress(e.target.value);
                  }} />
                  {/* the following i required becuase somethimes the error is in object type . i need a string type error here  */}
                  {error && typeof error === 'string' && <Alert severity="error">{error}</Alert>}
                  <Button color="secondary" size="small" variant='outlined' sx={{ marginTop: '2%', }} component='label'>Upload Profile Image
                    <input type="file" accept="image/*" hidden onChange={(e) => {
                      setFile(e.target.files[0]);
                    }} /></Button>
                  {/* now i want ki neeche waala button will be disabled when the page is loading */}
                  <Button color="primary" sx={{ width: '100%', marginTop: '2%', marginBottom: '2%', }} variant='contained' disabled={loading} onClick={handleSignup}>
                    SignUp
                  </Button>
                  <Typography component="div" variant='subtitle2' sx={{ color: 'grey', }}>
                    By signing up you agree to our "hamare yaha aisa hi hota hai
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ width: '25vw' }} variant="outlined" margin="normal">
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',  // Note: alignItems 'space-around' is not a valid value, so I used 'center'
                  textAlign: 'center'
                }} component="div">
                  <Typography component="div" variant='subtitle2' sx={{ color: 'grey', }}>
                    Already have an acccount? <Link to=''>LogIn</Link>
                  </Typography></CardContent>
              </Card>
            </div>
          </div>
        </div>
      }
    </>
  );
}




export default SignUp