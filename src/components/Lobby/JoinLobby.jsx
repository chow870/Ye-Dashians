import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function JoinLobby() {
  const navigate = useNavigate();
  const [lobbyId, setLobbyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = useSelector((state) => state?.auth?.user?._id);

  const handleJoin = async (e) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/lobby/join', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: userId,
          lobbyId: lobbyId,
          acceptedByUser2: true,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.success) {
        setLobbyId(data.lobby._id);
        const response2 = await fetch('/api/v1/user/addNewLobbyToUser', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lobbyId: lobbyId }),
        });

        if (!response2.ok) throw new Error('Network response was not ok');
        const data2 = await response2.json();

        if (data2.success) {
          setError(null);
        }
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
      console.error('Error joining lobby:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url("/pexels-pixabay-220072.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form className="w-full max-w-sm bg-black bg-opacity-90 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-4">
          <input
            className="appearance-none bg-gray-900 border border-purple-600 text-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:ring-purple-500"
            type="text"
            placeholder="Enter Lobby ID"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
          />

          <button
            type="button"
            disabled={loading}
            onClick={handleJoin}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Join Lobby
          </button>

          <button
            type="button"
            onClick={() => navigate('/createlobby')}
            className="text-purple-400 hover:text-purple-200 font-medium underline"
          >
            Create a new lobby
          </button>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">he bhagwan !! </strong>
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 01-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 01-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 011.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 111.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 010 1.698z" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default JoinLobby;
