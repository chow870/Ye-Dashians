import React, { useState, useEffect, useRef } from 'react';
import LobbiesCard from './LobbiesCard';
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";

function Lobbies() {
  const [error, setError] = useState();
  const [lobbies, setLobbies] = useState();
  const [refresh, setRefresh] = useState(Date.now()); // State to trigger re-fetching
  const myId = useSelector((state) => state?.auth?.user?._id);
  const location = useLocation();
  const highlightId = location.state?.highlightLobbyId;
  const highlightRef = useRef(null);
  const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
    async function fetchLobbies() {
      try {
        let res = await fetch(`${BackendBaseUrl}/api/v1/user/userProfile/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials : "include"
        });
        if (!res.ok) {
        
          throw new Error('Network response was not ok');
          
        }
        
      const resData = await res.json();
      
      if (resData.success) {
        setError(null);
        const user = resData.data;
        setLobbies(user.lobbies);
        // console.log(user.lobbies);
      }
    } catch (error) {
      
      setError(error.message);
      console.error('Error fetching lobbies:', error);
    }
  }
  // Call fetchLobbies whenever `refresh` changes
  useEffect(() => {
    fetchLobbies();
  }, [refresh]);

  useEffect(() => {
    if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightRef.current.classList.add("zoom-highlight");
        setTimeout(() => {
            highlightRef.current.classList.remove("zoom-highlight");
        }, 2000);
    }
}, [highlightId, lobbies]);

  const handleRefresh = async () => {
    setRefresh(Date.now());
    await fetchLobbies();
  }

  return (
    <div>
      <style>{`
                .zoom-highlight {
                    animation: zoomIn 0.5s;
                    background:hsl(0, 0.00%, 100.00%);
                    border: 2px solid #7e22ce;
                }
                @keyframes zoomIn {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }
            `}</style>
      <button
        onClick={() => handleRefresh()} // Toggle refresh state to trigger re-fetch
        className="px-4 py-4 bg-purple-700 text-white rounded"
      >
        Refresh Lobbies
      </button>
      {lobbies &&
        lobbies.map((lobby) => (
          <div ref={highlightId === (lobby) ? highlightRef : null}>
          <LobbiesCard key={lobby} lobbyId={lobby} refresh = {refresh} refreshParent = {handleRefresh}></LobbiesCard></div>
        ))}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Lobbies;