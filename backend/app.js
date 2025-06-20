const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const AuthRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', AuthRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  
