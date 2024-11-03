import React, { useState  , useEffect} from 'react'
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { database } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
function LobbiesCard(props) {
    // means here I have the lobbyId, myId, guestId. I shall pass/use it as per the requirenment in the Arch. : chow870
    const myId = useSelector((state) => {
        return state?.auth?.user?.uid
    })
    const [error,setError] = useState();
    const [lobby,setLobby] = useState(null);
    const [guest,setGuest] = useState();
    const [guestId,setGuestId]= useState();
    
    let lobbyId = props.lobbyId;
    console.log("the lobby id is ",lobbyId);
    let thatOne;
    // fetchthatone and fetchGuest ko lagana padega usestate ke andar , where snapshot lagaenge apan firestore ke users database ke upar
    useEffect(() => {
        async function fetchThatOne() {
            try {
                const response = await fetch('/api/v1/lobby/getAll', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.success) {
                    setError(null);
                    console.log("inside the fetchOne of Lobbies backend."
                    )
                    console.log( data.lobby)
                    console.log()
                    const foundLobby = data.lobby.find((lobby) => lobby._id === lobbyId);
                    setLobby(foundLobby || null);
                }
            } catch (error) {
                setError(error.message);
                console.error('Error fetching lobby:', error);
            }
        }

        fetchThatOne();

        const unsubscribe = database.users.onSnapshot((snapshot) => {
            console.log("Users collection changed, re-fetching lobbies...");
            fetchThatOne();
        });

     
        return () => unsubscribe();

    }, [lobbyId]);
    useEffect(() => {
        async function fetchGuest() {
            try {
                if (lobby) {
                    const guestId = myId !== lobby.user1 ? lobby.user1 : lobby.user2;
                    console.log("guestId is" , guestId)
                    setGuestId(guestId)
                    if(guestId)
                    {
                        const res = await database.users.doc(guestId).get();
                    setGuest(res.data().fullname);  // Assuming res.data() has the guest information
                    // console.log('Guest data:', res.data().fullname);
                    }
                    
                    
                }
            } catch (error) {
                console.error('Error fetching guest:', error);
            }
        }

        if (lobby) {
            fetchGuest();
        }
    }, [lobby, myId]);

    const navigate= useNavigate();
    const HandleCreateNewEvent = ()=>{
        console.log("reached the HandleCreateNewEvent ")
        console.log("the lobby is : ", lobby)
        if(lobby == null) return

        navigate('/preference/form',{
            state:{
                slotId:lobbyId,
                myId:myId,
                guestId:guestId
            }})
    }

  return (
    <div style={{border:'2px solid black' , display : 'flex'}}>
        
        <div style = {{width : '20%'}}>
       <CardContent sx={{textAlign:'left'}}>
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
        date
      </Typography>
      <Typography variant="h5" component="div">
      {thatOne?.time}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>time</Typography>
      <Typography variant="body2">
      {thatOne?.time}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>venue</Typography>
      <Typography variant="body2">
      {thatOne?.venue}
      </Typography>
    </CardContent>
    <CardActions>
        {thatOne?.venue == null ? <Button size="small" variant='outlined' 
        onClick={HandleCreateNewEvent}       
        >Create The Plans</Button>: <Link><Button size="small" variant='outlined'>View/Alter Your Plans</Button></Link>}
    </CardActions>
    </div>
    <div style = {{width : '80%' , textAlign : 'right' , display : 'flex' ,flexDirection : 'column', justifyContent : 'center' , alignItems : 'right'}}><Typography style={{fontSize:'30px',margin:'15px'}}>have to meet</Typography>
    <Typography style={{fontSize:'70px'}}>{guest}</Typography>
    </div>
    </div>
  )
}

export default LobbiesCard