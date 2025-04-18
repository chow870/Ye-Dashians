import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { database } from '../../firebase';
import { useNavigate } from 'react-router-dom';
function JoinLobby() {

    const navigate = useNavigate();
    const [lobbyId, setLobbyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userId = useSelector((state) => {
        return state?.auth?.user?._id
    })

    const handleJoin = async(e) => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/lobby/join', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    "guestId" : userId,
                    "lobbyId" : lobbyId,
                    "acceptedByUser2" : true
                 }),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setLoading(false);
                setLobbyId(data.lobby._id);
                setError(null);

                const response2 = await fetch('/api/v1/user/addNewLobbyToUser', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({lobbyId:lobbyId}),
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


   

    return (
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-300">
    <form class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center border-b border-teal-500 py-2">
            <input
                class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="lobby ID"
                aria-label="lobby ID" onChange={(e)=>{setLobbyId(e.target.value)}}
            />
            <button
                class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button" disabled={loading} onClick={handleJoin}
            >
               join lobby
            </button>
            <button
                class="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                type="button" onClick={()=>{
                    navigate('/createlobby')
                }}
            >
                create a new lobby
            </button>
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
    </form>
</div>

    )
}

export default JoinLobby