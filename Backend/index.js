const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()

app.use(cors())
app.use(express.json())

const mongodb_username = process.env.MONGODB_USERNAME
const mongodb_password = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb+srv://${mongodb_username}:${mongodb_password}@taskmanager.e9veqsx.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager`)

const db = mongoose.connection;

db.on('error',(err)=>{
    console.log('MongoDB Connection Error', err);
})

db.once('open',()=>{
    console.log('Connected to MongoDB')
})

db.on('disconnected',()=>{
    console.log('MongoDB Disconnected')
})

const PORT = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send('HELOO USER')
})


// mongodb+srv://hruthvikababburi:<password>@taskmanager.e9veqsx.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager


app.listen(PORT,()=>{console.log(`Running Server at ${PORT}`)})