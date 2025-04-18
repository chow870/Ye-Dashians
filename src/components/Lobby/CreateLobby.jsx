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
    const filteredUsers = useMemo(() => {
        if(users)
        {
             return users.filter((user) =>
            user.fullname.toLowerCase().includes(filter.toLowerCase())
            );
        }
       
      }, [users, filter]);





    const [lobbyId, setLobbyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const userId = useSelector((state) => {
        return state?.auth?.user?._id
    })
    const location = useLocation();
    const {eventDetails} = location.state||[];
    console.log(eventDetails);
    const handleButtonClick = async (e) => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/lobby/createNew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "creatorId": userId, eventDetails:eventDetails }),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            if (data.success) {
                setLoading(false);
                setLobbyId(data.lobby._id);
                setError(null);}

                // adding this lobby into the users firebase database
            let newLobby = data.lobby._id;  
            
            
            setLoading(true);
            const response2 = await fetch('/api/v1/user/addNewLobbyToUser', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({lobbyId:newLobby}),
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
            const response = await fetch('/api/v1/lobby/join', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "guestId" : guestId,
                    "lobbyId" : lobby,
                    "acceptedByUser2" : false
                 }),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setLoading(false);
                setError(null);

                const response2 = await fetch('/api/v1/user/addNewLobbyToUser', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({lobbyId:lobbyId,id:guestId}),
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
            let response = await fetch('api/v1/user/getAll',{
                method : "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
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
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-300">
                <h1 className="text-3xl font-bold text-white mb-8">Lobby Generator</h1>
                <button
                    onClick={handleButtonClick} disabled={loading}
                    className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                    Generate Lobby ID
                </button>
                {lobbyId && (
                    <div className="mt-8 p-4 bg-white rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Your Lobby ID:</h2>
                        <p className="text-xl text-gray-600">{lobbyId}</p>
                        <h2 className="text-2xl font-semibold text-gray-800">share this lobby id with ur friends to invite them</h2>
                    </div>
                )}
                {(lobbyId && users) && ( <Card sx={{ maxWidth: 500, margin: 'auto', padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Invite Friends to Lobby
      </Typography>

      <Autocomplete
        options={users}
        getOptionLabel={(option) => option.fullname}
        onInputChange={(event, newInputValue) => setFilter(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} label="Search friends…" variant="outlined" />
        )}
        sx={{ mb: 2 }}
      />
         <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
      <List dense>
        {filteredUsers.map((user) => (
          <ListItem
            key={user._id}
            secondaryAction={
              <Button
                variant="contained"
                size="small"
                onClick={() => sendRequest(lobbyId, user._id)}
              >
                Invite
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar src={user.profileImage} alt={user.fullname} />
            </ListItemAvatar>
            <ListItemText
              primary={user.fullname}
              secondary={user.email}
            />
          </ListItem>
        ))}
      </List>
      </Box>
    </Card>)}
                {error && (
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">he bhagwan !!</strong>
                        <span class="block sm:inline">{error}</span>
                        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateLobby