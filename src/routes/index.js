const {Router} = require('express');
const router = Router();
const dovent = require('dotenv');
const db = require('../database/db');
let sql = '';

dovent.config();


//Ruta Principal
router.get("/" , (req, res) => {
    sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id'
    db.all(sql, (err, result) => {
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


//Ruta para iniciar session
router.get('/login', (req, res) => {
  res.render('login.ejs')
});


//Ruta para verificar si existe el usuario
router.post('/login', (req, res) => {
  const usuario = req.body.usuario;
  const password = req.body.password;
  const user = process.env.USUARIO;
  const pass = process.env.PASSWORD;
  if(usuario == user && password == pass) {
    res.redirect('/admin')
  } else {
    res.send('Usuario y/o contraseña incorrectos')
  }
});

router.get('/admin', (req, res) => {
  sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id'
    db.all(sql, (err, result) => {
      if(err) {
        console.log(err)
      } else {
        //console.log(result);
        res.render('admin.ejs', {productos : result});
        
      }
    })
})

router.get('/editar/:id', (req, res) => {
  const id = req.params.id;
    db.all(`SELECT * FROM productos WHERE id=?`,id,  (error, result) => {
        if (error) {
            throw error;
        }else{       
            
              
            res.render('editar.ejs', {producto:result[0]});            
        }        
    });
})


router.post('/editar', async (req, res) => {
  const id = await req.body.id;
  const nombre = await req.body.nombre;
  const descripcion = await req.body.descripcion;
  const precio = await req.body.precio;
  const codigo = await req.body.codigo;
  db.run(`UPDATE productos SET nombre = ?, precio = ?, codigo = ?,descripcion = ?  WHERE id = ${id}`, [nombre, precio, codigo, descripcion], (error, results)=>{
    if(error){
        console.log(error);
    }else{
        //console.log(results);   
        res.redirect('/admin');         
    }
  })
})

router.get('/crear', (req, res) => {
  db.all(`SELECT * FROM categorias`, (error, result)=>{
    if(error){
        console.log(error);
    } else {
      console.log(result)
      res.render('crear.ejs', {categorias : result})
    }
  })
})

router.post('/crear', async(req, res)=>{
  const nombre = await req.body.nombre;
  const descripcion = await req.body.descripcion;
  const precio = await req.body.precio;
  const codigo = await req.body.codigo;
  const categoria = await req.body.categoria;
  db.run('INSERT INTO productos (nombre, precio, codigo, descripcion, categorias_id) VALUES (?, ?, ?, ?, ?)',[nombre, precio, codigo,descripcion,  categoria], (error, results)=>{
      if(error){
          console.log(error);
      }else{
          //console.log(results);   
          res.redirect('/admin');         
      }
    })
})


router.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM productos WHERE id = ?',[id], (error, results)=>{
      if(error){
          console.log(error);
      }else{           
          res.redirect('/admin');         
      }
  })
});


router.get('/addImg/:id', (req, res) => {
  const id = req.params.id;
    db.all(`SELECT * FROM productos WHERE id=?`,id,  (error, result) => {
        if (error) {
            throw error;
        }else{      
            //console.log(result);
            res.render('addImg.ejs', {producto:result[0]});            
        }        
    });
})

router.post('/addImg', async(req, res)=>{
  const producto_id = await req.body.producto_id;
  const url = await req.body.url;
  const destacado = await req.body.destacado;
  db.run('INSERT INTO imagenes (producto_id, url, destacado) VALUES (?, ?, ?)',[producto_id, url, destacado], (error, results)=>{
      if(error){
          console.log(error);
      }else{
          //console.log(results);   
          res.redirect('/admin');         
      }
    })
})








module.exports = router;