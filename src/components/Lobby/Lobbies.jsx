import React, { useState, useEffect } from 'react';
import LobbiesCard from './LobbiesCard';
import { useSelector } from 'react-redux';

function Lobbies() {
  const [error, setError] = useState();
  const [lobbies, setLobbies] = useState();
  const [refresh, setRefresh] = useState(Date.now()); // State to trigger re-fetching
  const myId = useSelector((state) => state?.auth?.user?._id);

    async function fetchLobbies() {
      try {
        let res = await fetch('/api/v1/user/userProfile/me', {
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


  const handleRefresh = async () => {
    setRefresh(Date.now());
    await fetchLobbies();
  }

  return (
    <div>
      <button
        onClick={() => handleRefresh()} // Toggle refresh state to trigger re-fetch
        className="px-4 py-4 bg-purple-700 text-white rounded"
      >
        Refresh Lobbies
      </button>
      {lobbies &&
        lobbies.map((lobby) => (
          <LobbiesCard key={lobby} lobbyId={lobby} refresh = {refresh} refreshParent = {handleRefresh}></LobbiesCard>
        ))}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Lobbies;