const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

//Routes
const userRoutes = require('./routes/user');

const path = require('path');

//Mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xxanx.mongodb.net/Projet_6?retryWrites=true&w=majority`,
{
    useNewUrlParser : true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((err) => console.log('Connexion a MongoDB échouée !' + err));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use(express.json());

app.use('/api/auth', userRoutes);

module.exports = app;