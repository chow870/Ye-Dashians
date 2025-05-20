import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { database } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
    TextField,
    Rating,
    Stack
} from '@mui/material';
import io from 'socket.io-client'
const socket = io.connect('http://localhost:5000')


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function LobbiesCard(props) {
    const myId = useSelector((state) => {
        return state?.auth?.user?._id
    })
    const [error, setError] = useState();
    const [lobby, setLobby] = useState();
    const [guest, setGuest] = useState();
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(null)
    const [guestId, setGuestId] = useState('')
    const [loading , setLoading] = useState(false);
    const [venueCoords , setVenueCoords] = useState(null);
    const [eventDetails,setEventDetails]= useState([]);
    const [accepted,setAccepted] = useState(false);
    const navigate = useNavigate()



    let lobbyId = props.lobbyId;
    console.log(lobbyId);
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
                    const foundLobby = data.lobby.find((lobby) => lobby._id === lobbyId);
                    setLobby(foundLobby || null);
                    console.log("foundlobby is", foundLobby)
                    const lobbyTime = foundLobby?.time ? dayjs(foundLobby.time) : dayjs();
                    setDate(lobbyTime.format('DD MMM YYYY'));
                    setTime(lobbyTime.format('HH:mm'));
                    setVenueCoords(foundLobby?.venueCoordinates);
                    setEventDetails(foundLobby?.eventDetails);
                    setAccepted(foundLobby?.acceptedByUser2);
                }
            } catch (error) {
                setError(error.message);
                console.error('Error fetching lobby:', error);
            }
        }

        fetchThatOne();
    }, [props.refresh]);



    useEffect(() => {
        async function fetchGuest() {
          console.log("fetching the guest name")
            try {
                if (lobby) {
                    const fetchedGuestId = myId !== lobby.user1 ? lobby.user1 : lobby.user2;
                    setGuestId(fetchedGuestId)
                    
                    let res = await fetch(`/api/v1/user/userProfile/${fetchedGuestId}`, {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });
                      if (!res.ok) {
                       
                        throw new Error('Network response was not ok');
                      }
                       
                      const resData = await res.json();
                      
                      if (resData.success) {
                        setError(null);
                        const guestData = resData.data;
                        const guestName = guestData.fullname;
                       
                        setGuest(guestName);
                      }

                }
            } catch (error) {
                console.error('Error fetching guest:', error);
            }
        }

        if (lobby) {
            fetchGuest();
        }
    }, [props.refresh,lobby]);



    const HandleCreateNewEvent = () => {
        console.log("reached the HandleCreateNewEvent ")
        console.log("the lobby is : ", lobby)
        if (lobby == null) return

        navigate('/preference/form', {
            state: {
                slotId: lobbyId,
                myId: myId,
                guestId: guestId,
                eventDetails:eventDetails
            }
        })
    }

    const deleteEverything = async () => {

        const deleteFromUser1 = fetch('/api/v1/user/removeLobby',{
          method : 'PATCH',
          headers: {
            'Content-Type': 'application/json'
        },
          body : JSON.stringify({
            id : myId,
            lobby_id : lobbyId
          })
        });

        const deleteFromUser2 = fetch('/api/v1/user/removeLobby',{
          method : 'PATCH',
          headers: {
            'Content-Type': 'application/json'
        },
          body : JSON.stringify({
            id : guestId,
            lobby_id : lobbyId
          })
        });

        const deleteLobby = fetch(`/api/v1/lobby/delete?slotId=${lobbyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const deleteLobbyPreferences = fetch(`/api/v1/preferenceSubmit?slotId=${lobbyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const deleteLobbyMatchingPreferences = fetch(`/api/v1/preferenceMatching?slotId=${lobbyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        Promise.all([deleteFromUser1 , deleteFromUser2 , deleteLobbyMatchingPreferences, deleteLobbyPreferences, deleteLobby])
            .then(ArrayOfResponses => Promise.all(ArrayOfResponses.map(response => response.json())))
            .then(res => {
                console.log("All the promises have been resolved", res);
            })
            .catch(err => {
                console.log("Some error occurred", err.message);
            });

            props.refreshParent();

    }



    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


// the states for the reviews page
    const [reviewData, setReviewData] = useState({
        userName: '',
        text: '',
        stars: 0
      });

// event listeners for the reviews page
      const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleRatingChange = (event, newValue) => {
        setReviewData((prevData) => ({
          ...prevData,
          stars: newValue,
        }));
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        

        try {
            setLoading(true);
            const response = await fetch('/api/v1/review/createNew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    slotId : lobbyId,
                    userId : myId,
                    userName : reviewData.userName,
                    text : reviewData.text,
                    stars : reviewData.stars,
                    placeId : lobby?.venueId
                })
            });

            if(!response.ok)
            {
                setLoading(false)
                setError("some error occureed");
                setTimeout(() => {
                    setError("")
                }, 5000);
            }
            else
            {
                console.log("review posted successFully")
            }


        } catch (error) {
            setLoading(false);
            // console.log(error)
            setError(error.message);
                setTimeout(() => {
                    setError("")
                }, 5000);
        }


      };



      const acceptRequest = async function() {
        try{
          const response = await fetch('/api/v1/lobby/acceptByUser2',{
            method : "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body : JSON.stringify({lobbyId:lobby._id})
          })
          if (!response.ok) {
            setLoading(false);
            throw new Error('Network response was not ok');
          }
          const resp = await response.json();
          if(resp.success)
          {
            console.log(resp.message) 
            setLoading(false);
            props.refreshParent();
          }
        }catch(err)
        {
          setLoading(false);
            // console.log(error)
            setError(err.message);
                setTimeout(() => {
                    setError("")
                }, 5000);
        }
      }
      
      
      const sendRequest = function(){
        const sentLobbyId = lobbyId
        navigate('/createlobby', {
        state: { sentLobbyId }
        });
      }


      useEffect(() => {
        socket.on('lobby_updated',async ()=>{
          console.log("the lobby updated event is received")
          await props.refreshParent();
        })
      },[])


    return (
      <div>{(accepted || lobby?.user1==myId)?(<div style={{
        border: '2px solid #444',
        backgroundColor: '#222',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        position: 'relative',
        color: '#eee',
      }}>
        
        {/* Top-right Button */}
        <Button
          variant="outlined"
          size="small"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1,
            color: '#f44336',
            borderColor: '#f44336',
          }}
          onClick={deleteEverything}
        >
          End This Session
        </Button>
          
          {(guest==undefined || guest=='') && (<Button
          variant="outlined"
          size="small"
          style={{
            position: 'absolute',
            top: '10px',
            right: '170px',
            zIndex: 1,
            color: '#f44336',
            borderColor: '#f44336',
          }}
          onClick={sendRequest}
        >
          send request
        </Button>)}

        <div style={{ width: '40%' }}>
            <CardContent sx={{ textAlign: 'left' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    LobbyID: {lobbyId}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    date
                </Typography>
                <Typography variant="h5" component="div">
                    {date}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>time</Typography>
                <Typography variant="body2">{time}</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>venue</Typography>
                <Typography variant="body2">{lobby?.venue}</Typography>
            </CardContent>
            <CardActions>
                {lobby?.venue == null ? (
                    <Button size="small" variant="outlined" onClick={HandleCreateNewEvent}>
                        Create The Plans
                    </Button>
                ) : (
                    <>
                    <Button size="small" variant="outlined" onClick={()=>{
                        navigate(`/myLobby/${lobbyId}` , {
                            state: {
                                myId,
                                guest,
                                guestId,
                                lobbyId,
                                venuePlaceId : lobby?.venueId,
                                locationCoords : venueCoords,
                                venueName : lobby?.venue
                            }
                        })
                    }}>
                        Alter/change ur plans
                    </Button>
                    <Button size="small" variant="outlined" onClick={()=>{
                        navigate('/trip' , {
                            state: {
                                myId,
                                guest,
                                guestId,
                                lobbyId,
                                placeId : lobby?.venueId,
                                venueCoords
                            }
                        })
                    }}>
                   Start trip
                </Button>
              </>
            )}
            {lobby?.venueId && (
              <Button size="small" variant="outlined" onClick={handleOpen}>
                Review This Place
              </Button>
            )}
          </CardActions>
        </div>
  
        <div style={{
          width: '60%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography style={{ fontSize: '24px', margin: '10px', color: '#aaa' }}>
            Meeting with
          </Typography>
          <Typography style={{ fontSize: '50px', color: '#fff' }}>{guest}</Typography>
        </div>
  
        {/* Modal for Review Submission */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 600,
              margin: '2rem auto',
              padding: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: '#333',
              color: '#eee',
            }}
          >
            <Typography variant="h5" gutterBottom align="center" sx={{ color: '#4caf50' }}>
              Submit Your Review
            </Typography>
  
            <Stack spacing={2}>
              <TextField
                label="User Name"
                name="userName"
                value={reviewData.userName}
                onChange={handleChange}
                required
                fullWidth
                sx={{ backgroundColor: '#444', borderRadius: 1 }}
                InputLabelProps={{ style: { color: '#bbb' } }}
                InputProps={{ style: { color: '#eee' } }}
              />
  
              <TextField
                label="Review Text"
                name="text"
                value={reviewData.text}
                onChange={handleChange}
                multiline
                rows={4}
                required
                fullWidth
                sx={{ backgroundColor: '#444', borderRadius: 1 }}
                InputLabelProps={{ style: { color: '#bbb' } }}
                InputProps={{ style: { color: '#eee' } }}
              />
  
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" sx={{ color: '#bbb' }}>Rating:</Typography>
                <Rating
                  name="stars"
                  value={reviewData.stars}
                  onChange={handleRatingChange}
                />
              </Box>
  
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ backgroundColor: '#4caf50' }}>
                Submit Review
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>) : (
          <div style={{
            border: '2px solid #444',
            backgroundColor: '#222',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            position: 'relative',
            color: '#eee',
          }}>
            {/* Top‑right Button */}
            <Button
              variant="outlined"
              size="small"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1,
                color: '#f44336',
                borderColor: '#f44336',
              }}
              onClick={deleteEverything}
            >
              Reject Request
            </Button>

            <div style={{ width: '40%' }}>
              <CardContent sx={{ textAlign: 'left' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  LobbyID: {lobbyId}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  date
                </Typography>
                <Typography variant="h5" component="div">
                  {date}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>time</Typography>
                <Typography variant="body2">{time}</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>venue</Typography>
                <Typography variant="body2">{lobby?.venue}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '170px',
                    zIndex: 1,
                    color: '#f44336',
                    borderColor: '#f44336',
                  }}
                  onClick={acceptRequest}
                >
                  Accept Request
                </Button>
              </CardActions>
            </div>

            <div style={{
              width: '60%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Typography style={{ fontSize: '24px', margin: '10px', color: '#aaa' }}>
                Meeting with
              </Typography>
              <Typography style={{ fontSize: '50px', color: '#fff' }}>
                {guest}
              </Typography>
            </div>
          </div>
        )}     
      </div>   
    );
  }      
export default LobbiesCard