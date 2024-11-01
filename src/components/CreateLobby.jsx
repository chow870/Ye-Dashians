import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { database } from '../firebase';
function CreateLobby() {
    const [lobbyId, setLobbyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userId = useSelector((state) => {
        return state?.auth?.user?.uid
    })
    const handleButtonClick = async (e) => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/lobby/createNew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "creatorId": userId }),
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

                // adding this lobby into the users firebase database
                let userDoc = await database.users.doc(userId).get();
                let userDocData = userDoc?.data();
                let obj
                if (userDocData?.lobbies != []) {
                    obj = [...userDocData.lobbies,data.lobby._id]
                }
                else {
                    obj = [data.lobby._id]
                }
                database.users.doc(userId).update({
                    lobbies: obj
                })

            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error creating lobby:', error);
        }
    };
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