import '../index.css'
import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { setAdminFalse, setAdminTrue} from '../redux/slices/authSlice';
import { useDispatch , useSelector} from 'react-redux';
import { googleProvider , githubProvider} from '../firebase';
import { auth } from '../firebase';
import { setUser } from '../redux/slices/authSlice';
import { database } from '../firebase';
function SignIn() {

   const user = useSelector((state) => {
       return state?.auth?.user;
     })
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [myUser, setMyUser] = useState(null);
    const [iAmAdmin , setIAmAdmin] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            
            const userData = {
                userEmail : email,
                userPassword : password
            }

            let res = await fetch("/api/v1/auth/login",{
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(userData),  
            })


            let resp = await res.json();

            if(resp)
            {
                let user = resp.userDetails;
                
                dispatch(setUser(user));
                
                
                console.log("fend",user2);  

            }
            else
            {
                setError("sign-in attemp failed");
                setTimeout(() => {
                setError('')
                }, 4000);
            }
            



            setLoading(false);
            navigate('/')
        } catch (error) {
            console.log(error.message);
            setError(error.message);
            setTimeout(() => {
                setError('')
            }, 4000);
            setLoading(false)
        }
    }


    const handleGoogleSignIn = async () => {
      try {
          setError('');
          setLoading(true);
          const result = await auth.signInWithPopup(googleProvider);
          
          

          const user = result.user;
          //console.log(user);

          
          

          const userEmail = user.email;
          // console.log(userEmail)
          
              
             const newUserData = {
              email: userEmail,
              fullname: user.displayName,
              isAdmin: false, 
              phoneno: user.phoneNumber,
              localUser : false,
              profileImage : user.photoURL
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
              console.error("Signup failed:", data.message || data);
              return;
            } else {
              console.log("Signup successful:");    
            
            const responseData = await response2.json()
             console.log(responseData)
            if(responseData.success)
            {
              let dbUser = responseData.data;
          //     console.log(responseData)
          //    console.log(dbUser)
              dispatch(setUser(dbUser));
            }
          }  
          navigate('/');
          setLoading(false);       
          }
         

        
           catch (error) {
          console.error("Google sign-in error:", error);
          setError(error.message);
          setTimeout(() => setError(''), 4000);
          setLoading(false);
      }
  };
      

    const handleGithubSignIn = async() => {
        try {
            setError('');
            setLoading(true);
            const result = await auth.signInWithPopup(githubProvider);
            const user = result.user;
            setMyUser(user);

            const res = await database.users.doc(user.uid).get();
            if(!res.exists)
            {
            const newres = await database.users.doc(user.uid).set({
                userId: user.uid,
                fullname: user.uid,
                profileUrl: user.photoURL,
                permLoc: "",
                curLoc: "",
                lobbies: [],
                isAdmin : false
            });
        }

            dispatch(setUser(user));
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError(error.message);
            setTimeout(() => setError(''), 4000);
            setLoading(false);
        }
    }

     useEffect(() => {
        
        if (user != null) {
          navigate('/')
        }
      }, [user])

    return (
        <div>

            {!iAmAdmin?
            <div className="flex justify-center">
                <div className='loginCard'>
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
                            {error != '' && <Alert severity="error">{error}</Alert>}
                            <Button fullWidth={true} color="primary" sx={{ width: '100%', marginTop: '2%', marginBottom: '2%', }} variant='contained' onClick={handleLogin} disabled={loading}>
                                Login
                            </Button>
                            <Button fullWidth={true} color="primary" sx={{ width: '100%', marginTop: '2%', marginBottom: '2%', }} variant='contained' onClick={handleGoogleSignIn} disabled={loading}>
                                Login with google
                            </Button>
                            <Button fullWidth={true} color="primary" sx={{ width: '100%', marginTop: '2%', marginBottom: '2%', }} variant='contained' onClick={handleGithubSignIn} disabled={loading}>
                                Login with github
                            </Button>
                            <Typography variant='subtitle2' sx={{ color: 'grey', marginTop: '10px' }}>
                                Password BhulGye?
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
                                Don't have an acccount? <Link to=''>SignUp</Link>
                            </Typography></CardContent>
                    </Card>
                </div>
            </div>:<div className="flex justify-center">
                <div className='loginCard' >

                </div>
                <div className='loginCard'>
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
                            {error != '' && <Alert severity="error">{error}</Alert>}
                            <Button fullWidth={true} color="primary" sx={{ width: '100%', marginTop: '2%', marginBottom: '2%', }} variant='contained' onClick={handleLogin} disabled={loading}>
                                Login
                            </Button>
                            <Typography variant='subtitle2' sx={{ color: 'grey', marginTop: '10px' }}>
                                Password BhulGye?
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
                                Don't have an acccount? <Link to=''>SignUp</Link>
                            </Typography></CardContent>
                    </Card>
                </div>
            </div>

            }
            <button onClick={()=>{
  setIAmAdmin(!iAmAdmin)
}}>{iAmAdmin?"i am user":"i am an admin"}</button>
        </div>
    )
}

export default SignIn