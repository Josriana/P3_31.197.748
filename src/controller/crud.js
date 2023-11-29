const db = require('../database/db');
const dovent = require('dotenv');

dovent.config()

function getProducts (req, res)  {
    let sql1 = 'SELECT * FROM categorias';
    let sql2 = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id'
    
    db.all(sql1, (err1, categorias) => {
      if (err1) {
        console.log(err1);
        return;
      }
      //console.log(categorias)
      db.all(sql2, (err2, productos) => {
        if (err2) {
          console.log(err2);
          return;
        }
        //console.log(productos)
        res.render('index.ejs', { categorias: categorias, productos: productos });
      });
    });
  }

function infoProduct(req, res)  {
    sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id  WHERE productos.id = ?'
    const id = req.params.id;
    db.all(sql, [id] , (error, results) => {
        if (error) {
            throw error;
        }else{            
            res.render('info.ejs', {producto :results[0]});   
              
        }        
    });
  }

function postLoging (req, res)  {
    const usuario = req.body.usuario;
    const password = req.body.password;
    
    const user = process.env.USUARIO;
    const pass = process.env.PASSWORD;
    if(usuario == user && password == pass) {
      res.redirect('/admin')
    } else {
      res.send('Usuario y/o contraseña incorrectos')
    }
}


function getAdmin (req, res) {
    let sql;
    sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id'
    let sql2 = 'SELECT * FROM categorias';
      db.all(sql, (err, result) => {
        if(err) {
          console.log(err)
        } else {
            //console.log(result);
              res.render('admin.ejs', {productos : result});
        }

      

    })
}

function getProduct (req, res)  {
    const id = req.params.id;
      db.all(`SELECT * FROM productos WHERE id=?`,id,  (error, result) => {
          if (error) {
              throw error;
          }else{        
            res.render('editar.ejs', {producto:result[0]});            
          }        
    });
}

function editProduct (req, res) {
    const id =  req.body.id;
    const nombre =  req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const codigo = req.body.codigo;
    const marca =  req.body.marca;
    const stock = req.body.stock;
    db.run(`UPDATE productos SET nombre = ?, precio = ?, codigo = ?,descripcion = ?, marca = ?, stock = ?  WHERE id = ${id}`, [nombre, precio, codigo, descripcion, marca, stock], (error, results)=>{
      if(error){
          console.log(error);
      }else{
          //console.log(results);   
          res.redirect('/admin');         
      }
    })
}

function createProduct (req, res)  {
    db.all(`SELECT * FROM categorias`, (error, result)=>{
      if(error) console.log(error);
      else {
        console.log(result)
        res.render('crear.ejs', {categorias : result})
      }
    })
}

function saveProduct (req, res) {
    const nombre =  req.body.nombre;
    const descripcion =  req.body.descripcion;
    const precio =  req.body.precio;
    const codigo =  req.body.codigo;
    const categoria =  req.body.categoria;
    const marca =  req.body.marca;
    const stock = req.body.stock;
    db.run('INSERT INTO productos (nombre, precio, codigo, descripcion, categorias_id, marca, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',[nombre, precio, codigo,descripcion,  categoria, marca, stock], (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //console.log(results);   
            res.redirect('/admin');         
        }
    })
}

function deleteProduct (req, res) {
    const id = req.params.id;
    db.run('DELETE FROM productos WHERE id = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('/admin');         
        }
    })
}

function addImg (req, res)  {
    const id = req.params.id;
    db.all(`SELECT * FROM productos WHERE id=?`,id,  (error, result) => {
          if (error) {
              throw error;
          }else{      
              //console.log(result);
              res.render('addImg.ejs', {producto:result[0]});            
          }        
    });
}

function saveImg (req, res) {
    const producto_id = req.body.producto_id;
    const url =  req.body.url;
    const destacado =  req.body.destacado;
    db.run('INSERT INTO imagenes (producto_id, url, destacado) VALUES (?, ?, ?)',[producto_id, url, destacado], (error, results)=>{
        if(error){
            console.log(error);
        }else{
            //console.log(results);   
            res.redirect('/admin');         
        }
    })
}





module.exports = {
    getProducts,
    infoProduct,
    postLoging,
    getAdmin, 
    getProduct,
    editProduct,
    createProduct,
    saveProduct,
    deleteProduct,
    addImg,
    saveImg
}