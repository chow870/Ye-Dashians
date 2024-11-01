import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { auth } from './firebase.jsx';
import { setLoading , setUser } from './redux/slices/authSlice.jsx';
import {onAuthStateChanged} from 'firebase/auth'
import { store } from './redux/store.jsx';
// auth.onAuthStateChanged((user) => {
//   store.dispatch(setUser(user));
//   store.dispatch(setLoading(false));
// });

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </Provider>  
)
