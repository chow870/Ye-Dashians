const express = require('express');
const app = express();
const mongoose = require('mongoose');
const lobbyRouter = require('./routes/lobbyRoute')
const cors = require('cors');
app.use(express.json());
app.listen(5000);
const db_link = 'mongodb+srv://ashutoshdigital:pXzjcCqx9L58oJz3@cluster0.vy40p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
  .then(() => console.log("MongoDB connection for beatBonds db is successful"))
  .catch(err => console.log(err));

app.use(cors());
app.use('/lobby', lobbyRouter);
  
