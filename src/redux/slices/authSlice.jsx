import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from '../../firebase';
import { database } from '../../firebase';
const initialState = {
    user: null,
    loading: false,
    error: null,
    isAdmin : false
  };

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkAPI) => {
      try {
        const res = await auth.signInWithEmailAndPassword(email, password);
        console.log(res);
        return res.user
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );



export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password}, thunkAPI) => {
    try {
      
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log("user of signup" , user.uid);
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      return thunkAPI.rejectWithValue(error.message || "Failed to sign up");
    }
  }
);

  export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
      try {
        await auth.signOut();
        return true;  
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

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
            state.user = action.payload;
          },
          setLoading(state, action) {
            state.loading = action.payload;
          },
        setAdminTrue(state,action){
          state.isAdmin = true;
        }  
      },
    
    extraReducers : (builder) => {
        builder
        .addCase(login.pending , (state,action) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled , (state,action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(login.rejected , (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(signup.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;  // Store the user data in the state
          })
          .addCase(signup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;  // Handle the error by storing the error message
          })
          // Handle logout
          .addCase(logout.fulfilled, (state) => {
            state.user = null;  // Clear the user data on logout
          });
    }
  })

  export const {resetAuthState , setLoading , setUser , setAdminTrue} = authSlice.actions;

  export default authSlice.reducer;