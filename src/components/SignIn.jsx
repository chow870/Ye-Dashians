import '../index.css'
import React, {useState} from 'react';
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
import { login } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

function SignIn() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            let res = await dispatch(login({email, password}));
            // console.log(res);
            // console.log(user.user);
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


    return (
        <div>
            <div className='loginWrapper'>
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
        </div>
    )
}

export default SignIn