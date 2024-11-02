import React from 'react'
import { useState  , useEffect} from 'react';
import LobbiesCard from './LobbiesCard';
import { database } from '../../firebase';
import { useSelector } from 'react-redux';
function Lobbies() {
    const [error,setError] = useState();
    const [lobbies,setLobbies] = useState();
    const myId = useSelector((state) => {
        return state?.auth?.user?.uid
    })
    useEffect(() => {
     
        async function fetchLobbies() {
            try {
                const userDoc = await database.users.doc(myId).get();
                if (userDoc.exists) {
                    const data = userDoc.data();
                    setLobbies(data.lobbies || []);
                    console.log("Fetched lobbies:", data.lobbies || []);
                } else {
                    setError("Document not found");
                }
            } catch (error) {
                setError(error.message);
                console.error("Error fetching lobbies:", error);
            }
        }

       
        fetchLobbies();

       
        const unsubscribe = database.users.onSnapshot((snapshot) => {
            console.log("Users collection changed, re-fetching lobbies...");
            fetchLobbies();
        });

     
        return () => unsubscribe();
    }, []);
  return (
    <div>
        { lobbies && lobbies.map((lobby) => (
                    <LobbiesCard lobbyId = {lobby}></LobbiesCard>
                ))}
    </div>
  )
}

export default Lobbies