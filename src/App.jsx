import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes } from 'react-router-dom';
import SignUp from './components/SignUp'
import SignIn from './components/SignIn';
import CreateLobby from './components/CreateLobby';
import JoinLobby from './components/JoinLobby';
import Navbar from './components/Navbar';
import LobbiesCard from './components/LobbiesCard';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Navbar/>
      <Routes>
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/createlobby' element={<CreateLobby/>} />
          <Route path='/joinlobby' element={<JoinLobby/>} />
      </Routes> */}
      <Routes><Route path='/joinlobby' element={<LobbiesCard/>} /></Routes>
      
    </>
  )
}

export default App
