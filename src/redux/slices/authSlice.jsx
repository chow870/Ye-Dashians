import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from '../../firebase';
import { database } from '../../firebase';
const initialState = {
    user: null,
    loading: false,
    error: null,
    isAdmin : false
  };


  

//   logout thunk (logout name is given due to export const logout): This is the async function that performs the actual logout logic using Firebase’s signOut method. It handles the request to log the user out of Firebase.
// extraReducers with .addCase(logout.fulfilled): This part listens for the status of the logout thunk. When the thunk is successful (i.e., the signOut operation completes), it triggers the fulfilled case

  export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        resetAuthState : (state , action) => {
          state.user = null;
          state.error = null;
          state.loading = false;
        },
        setUser(state, action) {
            console.log(action.payload);
            state.user = action.payload;
            state.isAdmin = action.payload.isAdmin;
          },
          setLoading(state, action) {
            state.loading = action.payload;
          },
        setAdminTrue(state,action){
          state.isAdmin = true;
        },
        setAdminFalse(state,action){
          state.isAdmin = false;
        }
      }
  })

  export const {resetAuthState , setLoading , setUser , setAdminTrue , setAdminFalse} = authSlice.actions;

  export default authSlice.reducer;