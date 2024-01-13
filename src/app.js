const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require('dotenv').config();
const axios = require('axios');



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

//Archivos Estaticos
app.use(express.static('public'));
app.use('/recourses', express.static(__dirname + '/public'))

app.use(session({
    secret : process.env.SECRET,
    resave : true,
    saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

//Puerto
const port = process.env.PORT || 3000;

//Rutas
app.use(require('../src/routes/index'))






app.listen(port, () => {
    console.log(`Servidor coriendo en el puerto ${port}`);
})
