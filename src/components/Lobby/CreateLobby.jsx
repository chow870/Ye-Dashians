import React, { useEffect, useState , useMemo} from 'react';
import { useSelector } from 'react-redux';
import { database } from '../../firebase';
import { useLocation } from 'react-router-dom';
import {
    Card,
    Typography,
    Autocomplete,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    Box,
  } from '@mui/material';
function CreateLobby() {
    const [users , setUsers] = useState(null)
    const [filter, setFilter] = useState('');
    const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
    const filteredUsers = useMemo(() => {
        if(users)
        {
             return users.filter((user) =>
            user.fullname.toLowerCase().includes(filter.toLowerCase())
            );
        }
       
      }, [users, filter]);




    const location = useLocation();
    
    const [lobbyId, setLobbyId] = useState(location?.state?.sentLobbyId? location.state.sentLobbyId : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const userId = useSelector((state) => {
        return state?.auth?.user?._id
    })

    const {eventDetails} = location.state||[];
    console.log(eventDetails);
    const handleButtonClick = async (e) => {
        try {
            setLoading(true);
            const response = await fetch(`${BackendBaseUrl}/api/v1/lobby/createNew`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "creatorId": userId, eventDetails:eventDetails }),
                credentials : "include",
            });
            console.log("Create lobby resp :",response);
            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Data is ",data);
            if (data.success) {
                setLoading(false);
                setLobbyId(data.lobby._id);
                setError(null);}

                // adding this lobby into the users firebase database
            let newLobby = data.lobby._id;  
            
            
            setLoading(true);
            const response2 = await fetch(`${BackendBaseUrl}/api/v1/user/addNewLobbyToUser`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({lobbyId:newLobby}),
                    credentials : "include",
                });
            
                if (!response2.ok) {
                    setLoading(false);
                    throw new Error('Network response was not ok');
                }
                
                const data2 = await response2.json();

                if (data2.success) {
                    setLoading(false);
                    setError(null);
                }

            
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error creating lobby:', error);
        }
    };


    const sendRequest = async function(lobby,guestId)
    {
        try {
            setLoading(true);
            const response = await fetch(`${BackendBaseUrl}/api/v1/lobby/join`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "guestId" : guestId,
                    "lobbyId" : lobby,
                    "acceptedByUser2" : false
                 }),
                 credentials : "include",
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setLoading(false);
                setError(null);

                const response2 = await fetch(`${BackendBaseUrl}/api/v1/user/addNewLobbyToUser`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({lobbyId:lobbyId,id:guestId}),
                    credentials : "include",
                });
                

                if (!response2.ok) {
                    setLoading(false);
                    throw new Error('Network response was not ok');
                }
                
                const data2 = await response2.json();

                console.log(data2)

                if (data2.success) {
                    setLoading(false);
                    setError(null);
                }
                

            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 5000);
            console.error('Error joining lobby:', error);
        }
    }

    const fetchFriends = async function(){

        try {
            setLoading(true);
            let response = await fetch(`${BackendBaseUrl}/api/v1/user/getAll`,{
                method : "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials : "include",
            })
            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }
            setLoading(false);
            const resData = await response.json();
            if(resData.success)
            {
                setUsers(resData.data)
            }


        } catch (error) {
            setLoading(false);
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 5000);
            console.error('Error fetching users:', error);
        }
    
    }

     useEffect(() => {
        fetchFriends();
      }, [] );

      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen"
          style={{
            backgroundImage: 'url("/pexels-pixabay-220072.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-3xl font-bold text-black mb-8">Lobby Generator</h1>
          <button
            onClick={handleButtonClick}
            disabled={loading}
            className="px-6 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out"
          >
            Generate Lobby ID
          </button>
    
          {lobbyId && (
            <div className="mt-8 p-4 bg-black bg-opacity-80 rounded-lg shadow-lg text-center text-white max-w-xl">
              <h2 className="text-2xl font-semibold">Your Lobby ID:</h2>
              <p className="text-xl break-all">{lobbyId}</p>
              <h2 className="text-2xl font-semibold mt-2">
                Share this lobby ID with your friends to invite them
              </h2>
            </div>
          )}
    
          {lobbyId && users?.length > 0 && (
            <Card
              sx={{
                maxWidth: 500,
                marginTop: 4,
                padding: 3,
                backgroundColor: "#000",
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom color="white">
                Invite Friends to Lobby
              </Typography>
    
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.fullname}
                onInputChange={(event, newInputValue) => setFilter(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search friends…"
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#ccc" } }}
                    InputProps={{
                      ...params.InputProps,
                      style: { color: "white" },
                    }}
                  />
                )}
                sx={{ mb: 2 }}
              />
    
              <Box sx={{ maxHeight: 120, overflowY: "auto" }}>
                <List dense>
                  {filteredUsers.map((user) => (
                    <ListItem
                      key={user._id}
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#7e22ce",
                            "&:hover": { backgroundColor: "#6b21a8" },
                          }}
                          onClick={() => sendRequest(lobbyId, user._id)}
                        >
                          INVITE
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={user.profileImage} alt={user.fullname} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.fullname}
                        secondary={user.email}
                        primaryTypographyProps={{ style: { color: "white" } }}
                        secondaryTypographyProps={{ style: { color: "#ccc" } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>
          )}
    
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <strong className="font-bold">he bhagwan !!</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>
      );
}

export default CreateLobby