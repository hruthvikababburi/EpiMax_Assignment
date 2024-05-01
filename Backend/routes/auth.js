const express = require('express')

const router = express.Router()
const User=require('../models/userModel')

const {generateToken} = require('../Utils/auth')
const {hashPassword,comparePassword} = require('../Utils/password')

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Compare passwords
        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Generate JWT token
        const token = generateToken(user);
        res.json({ token });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
})

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      const token = generateToken(newUser);
      res.status(201).json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});


module.exports= router;