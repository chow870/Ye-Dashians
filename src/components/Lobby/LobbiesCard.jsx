import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { database } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
function LobbiesCard(props) {
    const myId = useSelector((state) => {
        return state?.auth?.user?.uid
    })
    const [error, setError] = useState();
    const [lobby, setLobby] = useState();
    const [guest, setGuest] = useState();
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(null)
    const [guestId, setGuestId] = useState('')
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





    }, [myId, lobbyId]);
    useEffect(() => {
        async function fetchGuest() {
            try {
                if (lobby) {
                    const fetchedGuestId = myId !== lobby.user1 ? lobby.user1 : lobby.user2;
                    setGuestId(fetchedGuestId)
                    const res = await database.users.doc(fetchedGuestId).get();
                    setGuest(res.data().fullname);  // Assuming res.data() has the guest information
                    // console.log('Guest data:', res.data().fullname);

                }
            } catch (error) {
                console.error('Error fetching guest:', error);
            }
        }

        if (lobby) {
            fetchGuest();
        }
    }, [lobby, myId]);



    const HandleCreateNewEvent = () => {
        console.log("reached the HandleCreateNewEvent ")
        console.log("the lobby is : ", lobby)
        if (lobby == null) return

        navigate('/preference/form', {
            state: {
                slotId: lobbyId,
                myId: myId,
                guestId: guestId
            }
        })
    }

    // async function handleDeletePrefernce(slotId)
    // {
    //     try {
    //         const res  = await 
    //     } catch (error) {

    //     }
    // }

    const deleteEverything = async () => {
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

        Promise.all([deleteLobbyMatchingPreferences, deleteLobbyPreferences, deleteLobby])
            .then(ArrayOfResponses => Promise.all(ArrayOfResponses.map(response => response.json())))
            .then(res => {
                console.log("All the promises have been resolved", res);
            })
            .catch(err => {
                console.log("Some error occurred", err.message);
            });



        // now deleting the lobby from the fireStore database of both the users
        if (myId) {
            let userDoc = await database.users.doc(myId).get();
            let userDocData = userDoc?.data();
            let obj = userDocData.lobbies;
            let newObj = obj.filter((lob) => lob != lobbyId)
            database.users.doc(myId).update({
                lobbies: newObj
            })
        }

        if (guestId) {
            let userDoc2 = await database.users.doc(guestId).get();
            let userDocData2 = userDoc2?.data();
            let obj2 = userDocData2.lobbies;
            let newObj2 = obj2.filter((lob) => lob != lobbyId)
            database.users.doc(guestId).update({
                lobbies: newObj2
            })
        }


    }

    return (
        <div style={{ border: '2px solid black', display: 'flex', position: 'relative' }}>

            {/* Top-right Button */}
            <Button
                variant="outlined"
                size="small"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1,
                }}
                onClick={deleteEverything} // Replace 'someFunction' with the function you want to trigger
            >
                Band Karo Ye Tamasha
            </Button>

            <div style={{ width: '30%' }}>
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
                        <Button size="small" variant="outlined">
                            <Link to={`/myLobby/${lobbyId}`}>View/Alter Your Plans</Link>
                        </Button>
                    )}
                </CardActions>
            </div>

            <div
                style={{
                    width: '80%',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'right',
                }}
            >
                <Typography style={{ fontSize: '30px', margin: '15px' }}>
                    have to meet
                </Typography>
                <Typography style={{ fontSize: '70px' }}>{guest}</Typography>
            </div>
        </div>

    )
}

export default LobbiesCard