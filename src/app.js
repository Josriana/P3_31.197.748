const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

//Archivos Estaticos
app.use(express.static('public'));
app.use('/recourses', express.static(__dirname + '/public'))


app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Puerto
const port = process.env.PORT || 3000;

//Rutas
app.use(require('../src/routes/index'))






app.listen(port, () => {
    console.log(`Servidor coriendo en el puerto ${port}`);
})
