import React, { useState, useEffect } from "react";
// import { isLoaded } from 'react-redux-firebase'
// import { connect } from "react-redux";
// import * as authActions from '../../actions/authActions';
import { setUser } from "../redux/slices/authSlice";
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
import {storage} from "../firebase";





function SignUp(props) {
  const loads = useSelector((state) => {
    return state?.auth?.loading;
  })
  const user = useSelector((state) => {
    return state?.auth?.user;
  })





  const dispatch = useDispatch();


  let navigate = useNavigate()




  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('')
  const [fullname, setFullname] = useState('');
  // never give the default value of a file type as string , it would result in errors
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adress, setAdress] = useState('')
  const [iAmAdmin , setIAmAdmin] = useState(false);
  const [phoneNo , setPhoneNo] = useState('');
  const [OfficeAdress , setOfficeAdress] = useState('');
  const [website , setWebsite] = useState('');
  const [imgUrl,setImgUrl] = useState('');


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


        const userData = {
          email: email,
          fullname: fullname,
          isAdmin: iAmAdmin, 
          mywebsite: website,
          officeadress: OfficeAdress, 
          phoneno: phoneNo,
          password : password,
          confirmpassword : confirmPassword,
          localUser : true

        };


        const response = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        
        const responseData = await response.json()

        if (!response.ok) {
          console.error("Signup failed:", data.message || data);
          return;
        } else {
          console.log("Signup successful:");     
        }
        let userObj = responseData.data;
      
        let message = responseData.message;

        if(!userObj)
        {
          setError(message)
          setTimeout(() => {
            setError('')
        }, 4000);
        setLoading(false)
          return;
        }
        
        let id = userObj._id;
        

       

        const uploadTask = storage.ref(`/users/${id}/ProfileImage`).put(file);
        

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done.`);
            },
            (err) => {
              console.error(err.message);
              setError(err.message);
              setTimeout(() => {
                setError('');
              }, 4000);
              setLoading(false);
              reject(err);
            },
            async () => {
              const url = await uploadTask.snapshot.ref.getDownloadURL();
              setImgUrl(url);
              console.log(url);
              resolve(url);


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



//   function fn1(snapshot) {
//     let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log(`upload is ${progress}% done.`);
// }

// function fn2(err) {
//     console.log(err.message);
//     setError(err.message);
//     setTimeout(() => {
//         setError('');
//     }, 4000);
//     setLoading(false);
//     reject(err);
// }

// async function fn3() {
//     uploadTask.snapshot.ref.getDownloadURL().then((url) => {
//         setImgUrl(url);
//     });
//     setLoading(false);
//     navigate('/');
// }



  return (
    <>
      {/* To save from multiple request */}
      {/* {!isLoaded(props.auth)?<></>:<>*/}
      {loads ? <h4 style={{ marginTop: '10%', height: '52vh' }}>Patiently Wait...we are resgistering you in</h4> : <div>{
      !iAmAdmin?
        <div className="flex justify-center">
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
                  <TextField id="outlined-basic" label="cnfmPassword" variant="outlined" margin="normal" size="small" value={confirmPassword} onChange={(e) => {
                    setConfirmPassword(e.target.value);
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

:
<div className="flex justify-center">
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
            admin
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
        <TextField id="outlined-basic" label="Phone-No" variant="outlined" margin="normal" size="small" value={phoneNo} onChange={(e) => {
          setPhoneNo(e.target.value);
        }} />
        <TextField id="outlined-basic" label="Office - Address" variant="outlined" margin="normal" size="small" value={OfficeAdress} onChange={(e) => {
          setOfficeAdress(e.target.value);
        }} />
        <TextField id="outlined-basic" label="Website" variant="outlined" margin="normal" size="small" value={website} onChange={(e) => {
          setWebsite(e.target.value); 
        }} />
        {/* the following i required becuase somethimes the error is in object type . i need a string type error here  */}
        {error && typeof error === 'string' && <Alert severity="error">{error}</Alert>}
        {/* now i want ki neeche waala button will be disabled when the page is loading */}
        <Button color="primary" sx={{ width: '100%', marginTop: '2%', marginBottom: '2%', }} variant='contained' disabled={loading} onClick={handleSignup2}>
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
<button onClick={()=>{
  setIAmAdmin(!iAmAdmin)
}}>{iAmAdmin?"i am user":"i am an admin"}</button>
</div>
      }
    </>
  );
}




export default SignUp