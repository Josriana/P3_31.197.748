const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

const port = process.env.PORT || 3000;




app.get('/', (req, res) => {
    res.render('index', {
        nombre : "Josriana Rojas",
        ci : '31.197.748',
        secc : 4
    });
})

app.listen(port, () => {
    console.log(`Servidor coriendo en el puerto ${port}`);
})
