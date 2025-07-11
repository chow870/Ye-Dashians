const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require('mongoose');
const lobbyRouter = require('./routes/lobbyRoute')
const PreferenceFormSubmitRouter = require('./routes/preferenceRoute');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const NearbySearchRouter = require('./routes/MapsRoutes/NearbySearch');
const PlaceIdSearchRouter = require('./routes/MapsRoutes/PlaceIdSearch');
const FetchCoordinatesRouter = require('./routes/FetchCoordinates');
const PreferenceMathcingRouter = require('./routes/PreferenceMatchingRoutes');
const FetchOtherPreferenceRouter = require('./routes/FetchOtherPreference');
const reviewRouter = require('./routes/reviewRoutes')
const WeatherSearchRouter = require('./routes/MapsRoutes/Aqi');
const FetchReviewRouter = require('./routes/FetchReviewsRoute');
const PictureSearchRouter = require('./routes/MapsRoutes/FetchPictures');
const FetchEventsRouter = require('./routes/FetchEvents');
const EventsPurchasedRouter = require('./routes/EventsPurchased');
const CreateNewEventRouter = require('./routes/CreateNewEvent');
const DeleteEventRouter = require('./routes/DeleteEvents');
const mailrouter = require('./routes/mailroutes')
const paymentroute = require('./routes/PaymentRoutes');
const FetchAdminEventsRouter = require('./routes/FetchAdminEvents');
const userRouter = require('./routes/UserRoutes')
const authRouter = require('./routes/AuthRoutes')
const httpServer = createServer(app);
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Your frontend's origin
    credentials: true // Allow credentials like cookies
  };
app.use(cors(corsOptions));
const io = new Server(httpServer, { 
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials : true
  }
 });
 global.io = io;
app.use(cookieParser()) 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
io.on("connection", (socket) => {
  // console.log(socket);
  console.log("socket is active to be connected")
  console.log("the id of socket is",socket.id)
  socket.on('Join Room' , (room)=>{
    console.log("joining room",room);
    socket.join(room)
  })

  socket.on('leave_room' , (room)=>{
    socket.leave(room)
  })
  socket.on("change_in_location" , (data) => {
    console.log("change in location is",data);
    io.to(data.lobbyId).emit("update_friend_location", data);
  });

  socket.on("PrivateMessage" , (data) => {
    console.log(data);
    io.to(data.lobbyId).emit("private-message-recieved", data)
  })
  socket.on("FinalizeMessage" , (data) => {
    io.to(data.lobbyId).emit("finalize-message-recieved", data)
  })
})

httpServer.listen(process.env.PORT,()=>{
  console.log("server is listening on port 8000")
});





mongoose.connect(process.env.DB_LINK)
  .then(() => console.log("MongoDB connection for beatBonds db is successful"))
  .catch(err => console.log(err));
app.use('/api/v1/lobby', lobbyRouter);
app.use('/api/v1/mail', mailrouter);
app.use('/api/v1/review' , reviewRouter);
app.use('/api/v1/pay' , paymentroute);
app.use('/api/v1/preferenceSubmit',PreferenceFormSubmitRouter );
app.use('/api/v1/fetchCoordinates',FetchCoordinatesRouter );
app.use('/maps/v1/NearbySearch',NearbySearchRouter);
app.use('/maps/v1/PlaceIdSearch',PlaceIdSearchRouter);
app.use('/api/v1/preferenceMatching',PreferenceMathcingRouter );
app.use('/api/v1/fetchOthersPreference',FetchOtherPreferenceRouter );
app.use('/maps/v1/WatherSearch',WeatherSearchRouter);
app.use('/api/v1/fetchReviews',FetchReviewRouter );
app.use('/maps/v1/photo',PictureSearchRouter);
app.use('/api/v1/fetchEvents',FetchEventsRouter);
app.use('/api/v1/EventsPurchased',EventsPurchasedRouter);
app.use('/api/v1/createNewEvent',CreateNewEventRouter);
app.use('/api/v1/deleteEvent',DeleteEventRouter);
app.use('/api/v1/fetchAdminEvents',FetchAdminEventsRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/auth',authRouter);

