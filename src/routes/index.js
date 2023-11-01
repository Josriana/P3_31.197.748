const {Router} = require('express');
const router = Router();
const db = require('../database/db')
let sql = '';

router.get("/" ,async (req, res) => {
    sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id'
    await db.all(sql, (err, result) => {
      if(err) {
        console.log(err)
      } else {
        res.render('index.ejs', {productos : result});
        //console.log(result);
      }
    })
})

// Ruta de productos
router.get('/productos', (req, res) => {
    res.send('Esta es la página de productos');
  });
  
  // Ruta de ofertas
router.get('/ofertas', (req, res) => {
    res.send('Esta es la página de ofertas');
});
  
  // Ruta de informacion del producto
router.get('/info/:id', (req, res) => {
  sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id  WHERE productos.id = ?'
  const id = req.params.id;
  db.all(sql, [id] , (error, results) => {
      if (error) {
          throw error;
      }else{            
          res.render('info.ejs', {producto :results[0]});   
                  
      }        
  });
});

router.get('/login', (req, res) => {
  res.render('login.ejs')
})





module.exports = router;