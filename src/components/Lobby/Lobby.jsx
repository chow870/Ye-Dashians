import React , {useEffect , useState} from 'react'
import { useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { database } from '../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io.connect('http://localhost:5000')
function Lobby() {
  const {lobbyId} = useParams();
  const [dateAndTime, setDateAndTime] = useState(dayjs());
  const minDateTime = dayjs();
  const [lobby , setLobby] = useState();
  const [error , setError] = useState();
  const [loading , setLoading] = useState(true);
  const [guest , setGuest] = useState();
  const [messages, setMessages] = useState([])
  const [inputValue , setInputValue] = useState()
  const [socketLoading, setSocketLoading] = useState(true)
  const myId = useSelector((state) => {
    return state?.auth?.user?.uid
})
  const [venue , setVenue] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { slotId,
    venuePlaceId,
    venueName,
    guestId,
    locationCoords
  } = location.state||{};

  useEffect(() => {
    socket.on("connect" , () => {
      console.log("frontend says connected with socket id" , socket.id)
      setSocketLoading(false);
      socket.emit("Join Room" , lobbyId)
    })
    socket.on("private-message-recieved" , (data) => {
      console.log("private-data" , data)
      setMessages((prev)=>[...prev , data.inputValue])
    })
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSubmit2 = (e) => {
    e.preventDefault(); 
    socket.emit("PrivateMessage" , {inputValue,lobbyId})
    setInputValue(''); 
  };
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
            if (data?.success) {
                setError(null);
                const foundLobby = data.lobby.find((lobby) => lobby._id === lobbyId);
                setLobby(foundLobby || null);
                // console.log("ut current lobby is" , foundLobby)
                const lobbyTime = foundLobby?.time ? dayjs(foundLobby.time) : dayjs();
                setDateAndTime(lobbyTime)
                setVenue(foundLobby.venue);
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
              const res = await database.users.doc(guestId).get();
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

const handleUpdate = async() => {
  try {
    setLoading(true);
    const response = await fetch('/api/v1/lobby/updateLobby', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
              "lobbyId" : lobbyId,
              "user1":myId,
              "user2":guestId,
              "venue" : venueName,
              "venueId":venuePlaceId,
              "time" : dateAndTime,
              "venCords" : locationCoords
         }),
    });
    if (!response.ok) {
        setLoading(false);
        throw new Error('Network response was not ok');
    }
    if (data.success) {
        setLoading(false);
        setError(null);
    }
} catch (error) {
    setLoading(false);
    setError(error.message);
    setTimeout(() => {
        setError('');
    }, 5000);
    console.error('Error updating lobby:', error);
}
navigate("/showlobbies")
}

  return (
    <div>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2">
  {/* Container for all cards */}
  <div className="w-full max-w-5xl mx-2 space-y-4 mt-20">
    
    {/* Top Row - Two Larger Cards */}
    <div className="flex space-x-4">
      {/* To Meet Who Card */}
      <div className="bg-white shadow-lg rounded-lg p-4 h-60 flex flex-col items-center justify-center text-center" style={{width: '40%'}}>
        <h2 className="text-xl font-semibold">To Meet </h2>
        <h1 className="text-xl font-semibold"> {guest}</h1>

      </div>

      {/* Date and Time Selector Card */}
      <div className="bg-white shadow-lg rounded-lg p-4 h-60 flex flex-col items-center justify-center text-center" style={{width: '60%'}}>
        <h2 className="text-xl font-semibold">Date and Time Selector</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Date & Time for ur meet"
          value={dateAndTime}
          onChange={(newValue) => setDateAndTime(newValue)}
          minDateTime={minDateTime} // sets the minimum date and time to the current moment
        />
      </DemoContainer>
    </LocalizationProvider>
      </div>
    </div>

    {/* Venue Selector - Larger Card */}
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center" style={{minHeight:'500px'}}>
  <h2 className="text-xl font-semibold mb-4">Venue Selector</h2>
  
  <div className="flex w-full space-x-4">
  {/* Left Div - 40% Width */}
  

  {/* Right Div - 60% Width */}
  {/* Chat wala feature yaha par hai */}
  <div className="w-2/5 bg-gray-200 p-4 rounded-lg" style={{ minHeight: '500px' }}>
    <h3 className="font-semibold text-gray-700 mb-2">Chat</h3>
    <form onSubmit={handleSubmit2}>
      {messages.map((payload , index)=>{
          return (
            <p key = {index}>{payload}</p>
          )
        })}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update state on input change
          placeholder="Enter something..."
        />
        <button type="submit" disabled={socketLoading}>Submit</button>
        </form>
  </div>
</div>
</div>
  </div>
  <button onClick = {handleUpdate} class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
  Update Lobby
</button>
</div>

    </div>
  )
}

export default Lobby