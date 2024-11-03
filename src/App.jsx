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
import MainPreference from './pages/Preference/MainPreference';
import PreferenceForm from './components/Preference/PreferenceForm';
import Lobbies from './components/Lobby/Lobbies';
import PrefernceMatching from './components/Preference/PreferenceMatching';
import ShowingResults from './components/Preference/ShowingResults';
import Lobby from './components/Lobby/Lobby'
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
          <Route path='/showlobbies' element={<Lobbies/>} /> 
          <Route path = '/myLobby/:lobbyId' element = {<Lobby/>} />
          <Route path='/preference' element={<MainPreference/>} >
         
              <Route path ='form' element={<PreferenceForm/>}/>
              <Route path ='matching' element={<PrefernceMatching/>}/>
              <Route path ='results' element={<ShowingResults/>}/>
          </Route>

          
      </Routes>
      
    </>
  )
}

export default App
