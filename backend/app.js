const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const AuthRoutes = require('./routes/auth');
const vendorRoutes = require("./routes/vendor");
const adminRoutes = require("./routes/admin");
const organizerRoutes = require("./routes/organizer");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true               
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organizer", organizerRoutes);

app.use('/api/auth', AuthRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  
