import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardActions, CardContent, Button,
  Typography, Modal, TextField, Rating, Stack
} from '@mui/material';
import { database } from '../../firebase';
import dayjs from 'dayjs';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000');

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1e1e1e',
  color: '#fff',
  border: '1px solid #333',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function LobbiesCard({ lobbyId, refresh, refreshParent }) {
  const myId = useSelector((state) => state?.auth?.user?._id);
  const navigate = useNavigate();

  const [lobby, setLobby] = useState(null);
  const [guest, setGuest] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guestId, setGuestId] = useState('');
  const [venueCoords, setVenueCoords] = useState(null);
  const [eventDetails, setEventDetails] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    userName: '',
    text: '',
    stars: 0,
  });

  // Fetch Lobby Details
  useEffect(() => {
    async function fetchLobbyDetails() {
      try {
        const res = await fetch('/api/v1/lobby/getAll');
        const data = await res.json();
        if (data.success) {
          const foundLobby = data.lobby.find((l) => l._id === lobbyId);
          setLobby(foundLobby || null);
          const parsedTime = foundLobby?.time ? dayjs(foundLobby.time) : dayjs(); 
          setDate(parsedTime.format('DD MMM YYYY'));
          setTime(parsedTime.format('HH:mm'));
          if (parsedTime.isValid()) {
            setDate(parsedTime.format('DD MMM YYYY'));
            setTime(parsedTime.format('HH:mm'));
          } else {
            console.warn('Invalid lobby time:', foundLobby?.time);
            setDate('Invalid');
            setTime('');
          }

          setVenueCoords(foundLobby?.venueCoordinates);
          setEventDetails(foundLobby?.eventDetails);
          setAccepted(foundLobby?.acceptedByUser2);
        }
      } catch (err) {
        console.error('Failed to fetch lobby:', err);
        setError('Failed to fetch lobby');
      }
    }

    fetchLobbyDetails();
  }, [refresh]);

  // Fetch Guest Info
  useEffect(() => {
    async function fetchGuest() {
      if (lobby) {
        const otherUserId = myId !== lobby.user1 ? lobby.user1 : lobby.user2;
        setGuestId(otherUserId);

        try {
          const res = await fetch(`/api/v1/user/userProfile/${otherUserId}`);
          const resData = await res.json();
          if (resData.success) {
            setGuest(resData.data.fullname);
          }
        } catch (err) {
          console.error('Failed to fetch guest:', err);
        }
      }
    }

    if (lobby) fetchGuest();
  }, [lobby]);

  // Socket Refresh
  useEffect(() => {
    socket.on('lobby_updated', async () => {
      await refreshParent();
    });

  }, []);

  // Event Handlers
  const handleCreateEvent = () => {
    navigate('/preference/form', {
      state: { slotId: lobbyId, myId, guestId, eventDetails },
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/v1/review/createNew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: lobbyId,
          userId: myId,
          userName: reviewData.userName,
          text: reviewData.text,
          stars: reviewData.stars,
          placeId: lobby?.venueId,
        }),
      });
      setLoading(false);
      if (!res.ok) throw new Error('Review failed');
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const deleteSession = async () => {
    try {
      await Promise.all([
        fetch('/api/v1/user/removeLobby', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: myId, lobby_id: lobbyId }),
        }),
        fetch('/api/v1/user/removeLobby', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: guestId, lobby_id: lobbyId }),
        }),
        fetch(`/api/v1/lobby/delete?slotId=${lobbyId}`, { method: 'DELETE' }),
        fetch(`/api/v1/preferenceSubmit?slotId=${lobbyId}`, { method: 'DELETE' }),
        fetch(`/api/v1/preferenceMatching?slotId=${lobbyId}`, { method: 'DELETE' }),
      ]);
      refreshParent();
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const acceptRequest = async () => {
    try {
      const res = await fetch('/api/v1/lobby/acceptByUser2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lobbyId: lobby?._id }),
      });
      const resp = await res.json();
      if (resp.success) refreshParent();
    } catch (err) {
      setError(err.message);
    }
  };

  const sendRequest = () => {
    navigate('/createlobby', { state: { sentLobbyId: lobbyId } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (_, newValue) => {
    setReviewData((prev) => ({ ...prev, stars: newValue }));
  };

  const cardStyles = {
    backgroundColor: '#1e1e1e',
    color: '#eee',
    padding: 3,
    borderRadius: 2,
    border: '1px solid #333',
    boxShadow: '0 0 10px rgba(0,0,0,0.6)',
    marginBottom: 1,
    margin : 1,
    display: 'flex',
    justifyContent: 'space-between',
  };

  return (
    <Box sx={cardStyles}>
      <Box sx={{ width: '45%' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">Lobby ID: {lobbyId}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>📅 {date}</Typography>
          <Typography variant="body2">🕒 {time}</Typography>
          <Typography variant="body2">📍 {lobby?.venue || 'Venue TBD'}</Typography>
        </CardContent>
        <CardActions>
          {lobby?.venue == null ? (
            <Button variant="outlined" onClick={handleCreateEvent}>Create Plans</Button>
          ) : (
            <>
              <Button variant="outlined" onClick={() => navigate(`/myLobby/${lobbyId}`, {
                state: { myId, guest, guestId, lobbyId, venuePlaceId: lobby?.venueId, locationCoords: venueCoords, venueName: lobby?.venue }
              })}>
                Alter Plans
              </Button>
              <Button variant="outlined" onClick={() => navigate('/trip', {
                state: { myId, guest, guestId, lobbyId, placeId: lobby?.venueId, venueCoords }
              })}>
                Start Trip
              </Button>
              <Button variant="outlined" onClick={() => setOpen(true)}>Review</Button>
            </>
          )}
          <Button variant="contained" color="error" onClick={deleteSession}>End Session</Button>
        </CardActions>
      </Box>

      <Box sx={{ width: '50%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">Meeting With</Typography>
        <Typography variant="h4" color="white">{guest || 'Pending...'}</Typography>
        {!accepted && guest && lobby?.user2 === myId && (
          <Box mt={2}>
            <Button variant="contained" color="success" onClick={acceptRequest}>Accept</Button>
            <Button variant="outlined" color="error" onClick={deleteSession} sx={{ ml: 2 }}>Reject</Button>
          </Box>
        )}
        {!guest && (
          <Button variant="outlined" color="warning" onClick={sendRequest} sx={{ mt: 2 }}>
            Send Request
          </Button>
        )}
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleReviewSubmit} sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Submit Review</Typography>
          <Stack spacing={2}>
            <TextField label="Your Name" name="userName" value={reviewData.userName} onChange={handleChange}
              fullWidth variant="outlined" sx={{ input: { color: '#fff' }, label: { color: '#bbb' } }} />
            <TextField label="Your Review" name="text" value={reviewData.text} onChange={handleChange}
              multiline rows={3} fullWidth variant="outlined" sx={{ input: { color: '#fff' }, label: { color: '#bbb' } }} />
            <Box>
              <Typography gutterBottom>Rating</Typography>
              <Rating value={reviewData.stars} onChange={handleRatingChange} />
            </Box>
            <Button type="submit" variant="contained" color="success" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

export default LobbiesCard;
