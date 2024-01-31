const db = require('../database/db');
const dovent = require('dotenv').config()
const nodemailer = require('nodemailer');
function getProducts(req, res) {
  let sql1 = 'SELECT * FROM categorias';
  let sql2 = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id';
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
    db.all(sql2, (err2, productos) => {
      if (err2) {
        console.log(err2);
        return;
        
      }
      db.all(sql4,[2],(err2,sql4) => {
        console.log(sql4)
      })  
      db.all(sql3, (err2, clasificacion) => {
        console.log(clasificacion)
        for(let i = 0; i < clasificacion.length; i++) {
          let valor = clasificacion[i]['AVG(calificacion.rating)'];
          console.log(valor); // Imprime: 4
        }
        //console.log(productos)
        res.render('index.ejs', {
          categorias: categorias,
          productos: productos, 
          calificacion:clasificacion
          
        });
      })
    });
  });
}

function infoProduct(req, res) {

  sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id INNER JOIN imagenes ON imagenes.producto_id = productos.id  WHERE productos.id = ?';
  const id = req.params.id;
  db.all(sql, [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render('info.ejs', { producto: results[0] });

    }
  });
}


function PasswordRecovery(req, res) {
  const { email } = req.body;
  console.log(email)
  const user = process.env.EMAIL;
  const pw = process.env.PASSWORDD;
  db.all(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (row.length == 0) {
      res.send('No se encuentra el email')
    }
    else {
      const transporter = nodemailer.createTransport({
        service: 'outlook',
        port: 587,
        tls: {
          ciphers: "SSLv3",
          rejectUnauthorized: false,
        },
        auth: {
          user: user,
          pass: pw,
        },
      });

      const mailOptions = {
        from: user,
        to: email,
        subject: '¡Tú contraseña!',
        html: `<h1>¡Hola!</h1><p>Correo:${email}</p><p>Contraseña:${row[0].password}`
        // html body
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send('Se le envio un correo electronico!')
        }
      });
    }
  })
}


function postLoging(req, res) {
  const usuario = req.body.usuario;
  const password = req.body.password;

  const user = process.env.USUARIO;
  const pass = process.env.PASSWORD;
  if (usuario == user && password == pass) {
    res.redirect('/admin')
  } else {
    res.send('Usuario y/o contraseña incorrectos');
  }
}


function getAdmin(req, res) {
  let sql;
  sql = 'SELECT * FROM categorias INNER JOIN productos ON categorias.id = productos.categorias_id'
  let sql2 = 'SELECT * FROM categorias';
  db.all(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      //console.log(result);
      res.render('admin.ejs', { productos: result });
    }



  })
}

function getProduct(req, res) {
  const id = req.params.id;
  db.all(`SELECT * FROM productos WHERE id=?`, id, (error, result) => {
    if (error) {
      throw error;
    } else {
      res.render('editar.ejs', { producto: result[0] });
    }
  });
}

function editProduct(req, res) {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const codigo = req.body.codigo;
  const marca = req.body.marca;
  const stock = req.body.stock;
  db.run(`UPDATE productos SET nombre = ?, precio = ?, codigo = ?,descripcion = ?, marca = ?, stock = ?  WHERE id = ${id}`, [nombre, precio, codigo, descripcion, marca, stock], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      //console.log(results);   
      res.redirect('/admin');
    }
  })
}

function createProduct(req, res) {
  db.all(`SELECT * FROM categorias`, (error, result) => {
    if (error) console.log(error);
    else {
      console.log(result)
      res.render('crear.ejs', { categorias: result })
    }
  })
}

function saveProduct(req, res) {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const codigo = req.body.codigo;
  const categoria = req.body.categoria;
  const marca = req.body.marca;
  const stock = req.body.stock;
  db.run('INSERT INTO productos (nombre, precio, codigo, descripcion, categorias_id, marca, stock) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, precio, codigo, descripcion, categoria, marca, stock], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      //console.log(results);   
      res.redirect('/admin');
    }
  })
}

function deleteProduct(req, res) {
  const id = req.params.id;
  db.run('DELETE FROM productos WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/admin');
    }
  })
}

function addImg(req, res) {
  const id = req.params.id;
  db.all('SELECT * FROM productos  INNER JOIN imagenes ON imagenes.producto_id = productos.id  WHERE productos.id = ?', id, (error, result) => {
    if (error) {
      throw error;
    } else {
      //console.log(result);
      res.render('addImg.ejs', { producto: result[0] });
    }
  });
}

function saveImg(req, res) {
  const producto_id = req.body.producto_id;
  const url = req.body.url;
  const destacado = req.body.destacado;
  db.run('INSERT INTO imagenes (producto_id, url, destacado) VALUES (?, ?, ?)', [producto_id, url, destacado], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      //console.log(results);   
      res.redirect('/admin');
    }
  })
}


function registerUser(req, res) {
  res.render('register.ejs');
}

function userActive(req, res) {
  const username = req.body.nombre;
  const email = req.body.correo;
  const password = req.body.password;
  const info = [username, email, password];
  const user = process.env.EMAIL;
  const pw = process.env.PASSWORDD;
  db.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', info, (error) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/login_user");
    }
  })
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    port: 587,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: user,
      pass: pw,
    },
  });

  const mailOptions = {
    from: user,
    to: email,
    subject: '¡Bienvenido a nuestra página web!',
    html: '<h1>¡Hola!</h1><p>Bienvenido nuestra página web! Esperamos que disfrutes de tu experiencia aquí. Si necesitas ayuda, no dudes en ponerte en contacto con nosotros. ¡Gracias por registrarte!</p>' // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function postLogin(req, res) {
  const email = req.body.correo;
  const password = req.body.password;
  console.log(password)
  db.all('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    } else if (row.length == 0) {
      res.send('Usuario no existe')
    }
    else if (row) {
      console.log(row)
      if (row[0].password === password) {
        console.log('Inicio de sesión exitoso');
        req.session.id_user = row[0].id
        console.log(req.session.id_user)
        req.session.username = row[0].name;
        req.session.status = 'active'
        res.redirect('/');
      } else {
        res.send('Contraseña incorrecta');
      }
    } else {
      console.log('El usuario no existe en la base de datos');
      res.send("usuario invalido")
    }
  });
}

function getComprar(req, res) {
  const id = req.params.id;
  //console.log(id)
  db.all('SELECT * FROM productos  INNER JOIN imagenes ON imagenes.producto_id = productos.id  WHERE productos.id = ?', id, (error, result) => {
    if (error) {
      throw error;
    } else {
      //console.log(result[0])    
      res.render('comprar.ejs', { producto: result[0] });
    }
  });
}

function getCalificacion(req, res) {
  const id = req.params.id;
  //console.log(id)
  db.all('SELECT * FROM productos  INNER JOIN imagenes ON imagenes.producto_id = productos.id  WHERE productos.id = ?', id, (error, result) => {
    if (error) {
      throw error;
    } else {
      //console.log(result[0])    
      res.render('calificacion.ejs', { producto: result[0] });
    }
  });
}



function fakepayment(req, res) {
  const id_producto = req.body.id_producto;
  const precio = req.body.precio;
  const cantidad = req.body.cantidad;
  const total = cantidad * precio;
  const id_user = req.session.id_user;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const fecha = `${day}/${month}/${year}`;
  db.run('INSERT INTO compras (id_user, id_producto, cantidad, total, fecha) VALUES (?, ?, ?, ?, ?)', [id_user, id_producto, cantidad, total, fecha], (err) => {
    if (err) {
      console.log(err)
      return
    }
    res.redirect('/estrellas/' + id_producto)
  });


  db.get('SELECT * FROM users WHERE id = ?', [id_user], (err, row) => {
    if (err); console.log(err);
    /*Confirmacion*/
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      port: 587,
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      auth: {
        user: "dfwaaaaaaaaaaaaaaa@outlook.com",
        pass: "132344xd",
      },
    });

    const mailOptions = {
      from: 'dfwaaaaaaaaaaaaaaa@outlook.com',
      to: 'probando@dispostable.com',
      subject: '¡Confirmacion de su compra!',
      html: '<h1>¡Hola!</h1><p>Su compra ah finalizado correctamente</p>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  })


}

function getVentas(req, res) {
  db.all('SELECT users.*, productos.*, compras.* FROM compras INNER JOIN users ON compras.id_user = users.id INNER JOIN productos ON compras.id_producto = productos.id', (e, result) => {
    if (e) {
      console.log(e);
      return
    }
    res.render('ventas.ejs', { compras: result })
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
  saveImg,
  registerUser,
  userActive,
  postLogin,
  getComprar,
  fakepayment,
  getVentas,
  PasswordRecovery,
  getCalificacion

}