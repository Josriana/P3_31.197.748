const { Router } = require('express');
const router = Router();
const db = require('../database/db');
const crud = require('../controller/crud.js')
const midelware = require('../controller/midelware.js');





//Ruta Principal
router.get("/", crud.getProducts)

// Ruta de informacion del producto
router.get('/info/:id', crud.infoProduct);

//Ruta para iniciar session de administrador
router.get('/login', (req, res) => {
  res.render('login_admin.ejs')
});


router.post('/star',(req,res) => { 
  const { rating } = req.body;
  console.log(rating)
  let sql1 = 'SELECT * FROM categorias';
  let sql2 = "SELECT * FROM productos LEFT JOIN calificacion ON productos.id = calificacion.producto_id INNER JOIN categorias ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id WHERE calificacion.rating = ?;"
  let sql3 = "SELECT productos.id, AVG(calificacion.rating) FROM calificacion INNER JOIN productos ON calificacion.producto_id = productos.id GROUP BY productos.id;"
  let sql4 = "SELECT * FROM productos LEFT JOIN calificacion ON productos.id = calificacion.producto_id WHERE calificacion.rating = ?"
  let user = req.session.status;
  if (user == undefined) req.session.status = 'inactive';

  db.all(sql1, (err1, categorias) => {
    if (err1) {
      console.log(err1);
      return;
    }
    //console.log(categorias)
    db.all(sql2, rating,(err2, productos) => {
      if (err2) {
        console.log(err2);
        return;
        
      }
      db.all(sql3, (err2, clasificacion) => {
        

        //for(let i = 0; i < clasificacion.length; i++) {
          //let valor = clasificacion[i]['AVG(calificacion.rating)'];
          //console.log(valor); // Imprime: 4
        //}
        //console.log(productos)
        res.render('index.ejs', {
          categorias: categorias,
          productos: productos, 
          calificacion:clasificacion
        });
      })
    });
  });
})



router.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword');
})

router.post('/forgotpassword', crud.PasswordRecovery);



//Ruta para verificar si existe el usuario
router.post('/login', crud.postLoging);

//Ruta para cargar la parte administrativa
router.get('/admin', crud.getAdmin);

//Ruta para editar producto
router.get('/editar/:id', crud.getProduct)

//Ruta para guardar el producto editado
router.post('/editar', crud.editProduct)

//Ruta para crear un producto
router.get('/crear', crud.createProduct)

//Ruta para guardar el producto creado
router.post('/crear', crud.saveProduct)

//Ruta para eliminar producto
router.get('/delete/:id', crud.deleteProduct);

//Ruta para añadir una imagen
router.get('/addImg/:id', crud.addImg);

//Ruta para guardar una imagen
router.post('/addImg', crud.saveImg);

router.get('/register', crud.registerUser);

router.post('/saveUser', crud.userActive);

//Ruta para iniciar session como usuario
router.get('/login_user', (req, res) => {
  res.render('login_users.ejs')
});

router.post('/login_user', crud.postLogin);

router.get('/prueba', (req, res) => {
  res.render('prueba.ejs')
});





router.get('/comprar/:id', midelware, crud.getComprar);

router.post('/comprar', crud.fakepayment);

router.get('/ventas', crud.getVentas)














router.post('/estrellas/:id', (req, res) => {
  const { radio } = req.body;
  const { id } = req.params;
  const id_user = req.session.id_user;
  const sql = "INSERT INTO calificacion(producto_id,user_id,rating) VALUES(?,?,?)";
  db.run(sql, [id, id_user, radio], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      let sql1 = 'SELECT * FROM categorias';
      let sql2 = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id';
      let user = req.session.status;
      if (user == undefined) req.session.status = 'inactive';
      console.log(user)
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
          res.render('index.ejs', {
            categorias: categorias,
            productos: productos
          });
        });
      });
    }
  })
})

router.get('/estrellas/:id', midelware, crud.getCalificacion)






module.exports = router;