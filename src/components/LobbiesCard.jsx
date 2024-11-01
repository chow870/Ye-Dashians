import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
function LobbiesCard(props) {
    let lobbyId = props.lobbyId;
    async function fetchThatOne(){
    try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/lobby/createNew', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "lobbyId": lobbyId }),
        });

        if (!response.ok) {
            setLoading(false);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            setLoading(false);
            setLobbyId(data.lobby._id);
            setError(null);
            
        }
    } catch (error) {
        setLoading(false);
        setError(error.message);
        console.error('Error creating lobby:', error);
    }
}
  return (
    <div style={{border:'2px solid black' , display : 'flex'}}>
        
        <div style = {{width : '20%'}}>
       <CardContent sx={{textAlign:'left'}}>
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
        date
      </Typography>
      <Typography variant="h5" component="div">
       monday
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>time</Typography>
      <Typography variant="body2">
        well meaning and kindly
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>venue</Typography>
      <Typography variant="body2">
        well meaning and kindly
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" variant='outlined'>Change Your Plans</Button>
    </CardActions>
    </div>
    <div style = {{width : '80%'}}></div>
    </div>
  )
}

export default LobbiesCard