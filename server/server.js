const express = require('express');
const app = express();
const mongoose = require('mongoose');
const lobbyRouter = require('./routes/lobbyRoute')
const PreferenceFormSubmitRouter = require('./routes/preferenceRoute');
const cors = require('cors');
const NearbySearchRouter = require('./routes/MapsRoutes/NearbySearch');
const PlaceIdSearchRouter = require('./routes/MapsRoutes/PlaceIdSearch');
const FetchCoordinatesRouter = require('./routes/FetchCoordinates');
const PreferenceMathcingRouter = require('./routes/PreferenceMatchingRoutes');
const FetchOtherPreferenceRouter = require('./routes/FetchOtherPreference');
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "*"
  }
 });
app.use(express.json());
io.on("connection", (socket) => {
  // console.log(socket);
  console.log("socket is active to be connected")
  console.log("the id of socket is",socket.id)
  socket.on('Join Room' , (room)=>{
    socket.join(room)
  })
  socket.on("PrivateMessage" , (data) => {
    console.log(data);
    io.to(data.lobbyId).emit("private-message-recieved", data)
  })
})

httpServer.listen(5000,()=>{
  console.log("server is listening on port 5000")
});






const db_link = 'mongodb+srv://ashutoshdigital:pXzjcCqx9L58oJz3@cluster0.vy40p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
  .then(() => console.log("MongoDB connection for beatBonds db is successful"))
  .catch(err => console.log(err));

app.use(cors());
app.use('/api/v1/lobby', lobbyRouter);
app.use('/api/v1/preferenceSubmit',PreferenceFormSubmitRouter );
app.use('/api/v1/fetchCoordinates',FetchCoordinatesRouter );
app.use('/maps/v1/NearbySearch',NearbySearchRouter);
app.use('/maps/v1/PlaceIdSearch',PlaceIdSearchRouter);
app.use('/api/v1/preferenceMatching',PreferenceMathcingRouter );
app.use('/api/v1/fetchOthersPreference',FetchOtherPreferenceRouter );