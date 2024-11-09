import { useState } from 'react'
import './App.css'
import './index.css'
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
import ShowingResults from './components/Preference/ShowingResults';
import Lobby from './components/Lobby/Lobby'
import PreferenceMatching from './components/Preference/PreferenceMatching';
import Trip from './components/trip/Trip'
import MoreDetailsCard from './components/Preference/MoreDetailsCard';
import { useSelector } from 'react-redux';
import HomePage from './components/Admin/HomePage';
function App() {
  const [count, setCount] = useState(0)
  const isAdmin = useSelector(state=>{
    return state.isAdmin;
  })
  return (
    <>
    <Navbar/>
      <Routes>
          <Route path='/' element={isAdmin?<HomePage/>:<SignUp/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/home' element={isAdmin?<HomePage/>:<MapWrapper/>} />
          <Route path='/createlobby' element={isAdmin?<HomePage/>:<CreateLobby/>} />
          <Route path='/trip' element={isAdmin?<HomePage/>:<Trip/>} />
          <Route path='/joinlobby' element={isAdmin?<HomePage/>:<JoinLobby/>} />
          <Route path='/showlobbies' element={isAdmin?<HomePage/>:<Lobbies/>} /> 
          <Route path = '/myLobby/:lobbyId' element = {isAdmin?<HomePage/>:<Lobby/>} />
          <Route path='/preference' element={isAdmin?<HomePage/>:<MainPreference/>} >
              <Route path ='form' element={isAdmin?<HomePage/>:<PreferenceForm/>}/>
              <Route path ='matching' element={isAdmin?<HomePage/>:<PreferenceMatching/>}/>
              <Route path ='results' element={isAdmin?<HomePage/>:<ShowingResults/>}/>
              <Route path ='moredetails' element={isAdmin?<HomePage/>:<MoreDetailsCard/>}/>
          </Route>

          
      </Routes>
      
    </>
  )
}

export default App
