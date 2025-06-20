const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      console.log('Received data:', { name, email, password, role });
  
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);
  
      const newUser = new Users({ name, email, password: hashedPassword, role });
      const savedUser = await newUser.save();
  
      console.log('Saved user:', savedUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
