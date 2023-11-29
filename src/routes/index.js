const {Router} = require('express');
const router = Router();
const db = require('../database/db');
const crud = require('../controller/crud.js')




//Ruta Principal
router.get("/" , crud.getProducts)
 
  // Ruta de informacion del producto
router.get('/info/:id', crud.infoProduct );

//Ruta para iniciar session
router.get('/login', (req, res) => {
  res.render('login.ejs')
});

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

router.get('/prueba', );



module.exports = router;