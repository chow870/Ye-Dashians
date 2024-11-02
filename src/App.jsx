import { useState } from 'react'
import './App.css'
import { Route,Routes } from 'react-router-dom';
import CreateLobby from './components/Lobby/CreateLobby';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import JoinLobby from './components/Lobby/JoinLobby';
import LobbiesCard from './components/Lobby/LobbiesCard';
import Navbar from './components/Common/Navbar';
import MapWrapper from './components/Home/Map';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
      <Routes>
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/home' element={<MapWrapper/>} />
          <Route path='/createlobby' element={<CreateLobby/>} />
          <Route path='/joinlobby' element={<JoinLobby/>} />
          <Route path='/showlobbies' element={<LobbiesCard/>} />
      </Routes>
      
    </>
  )
}

export default App
