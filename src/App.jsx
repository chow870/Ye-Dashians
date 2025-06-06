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
import AdminHomePage from './components/Admin/AdminHomePage';
import LandingPage from './components/LandingPage';
import UserHomePage from './components/UserHomePage';
import CreateEventForm from './components/Admin/CreateNewEvent';
import ProfilePage from './components/Admin/ProfilePage';
function App() {
  const [count, setCount] = useState(0)
  const isAdmin = useSelector(state=>{
    return state.auth.isAdmin;
  })
  const user = useSelector(state => {
    return state.auth.user;
  })
  console.log(isAdmin)
  return (
    <>
      <Navbar />
      <Routes> 
        <Route path='/' element={user ? (isAdmin ? <AdminHomePage /> : <UserHomePage />) : <LandingPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/home' element={isAdmin ? <AdminHomePage /> : <MapWrapper />} />
        <Route path='/createlobby' element={isAdmin ? <CreateEventForm /> : <CreateLobby />} />
        <Route path='/profile' element={<ProfilePage/>}/>

        <Route path='/trip' element={isAdmin ? <AdminHomePage /> : <Trip />} />
        <Route path='/joinlobby' element={isAdmin ? <AdminHomePage /> : <JoinLobby />} />
        <Route path='/showlobbies' element={isAdmin ? <AdminHomePage /> : <Lobbies />} />
        <Route path='/myLobby/:lobbyId' element={isAdmin ? <AdminHomePage /> : <Lobby />} />
        
        <Route path='/preference' element={isAdmin ? <AdminHomePage /> : <MainPreference />}>
          <Route path='form' element={isAdmin ? <CreateEventForm /> : <PreferenceForm />} />
          <Route path='matching' element={isAdmin ? <AdminHomePage /> : <PreferenceMatching />} />
          <Route path='results' element={isAdmin ? <AdminHomePage /> : <ShowingResults />} />
          <Route path='moredetails' element={isAdmin ? <AdminHomePage /> : <MoreDetailsCard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
