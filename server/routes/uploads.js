const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos validos son: ' + tiposValidos.join(', '),
                tipoEnviado: tipo
            }
        })

    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //Extenciones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son: ' + extensionesValidas.join(', '),
                extensionEnviada: extension
            }
        })
    }

    //Cambier nombre al archivo
    let nombreArchivo = `${id}-${new Date().getTime()}.${extension}`

    archivo.mv(`uploads/${tipo}/${ nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, archivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(archivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(archivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = archivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: archivo
            });
        });
    });
}

function imagenProducto(id, res, archivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(archivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(archivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');
        productoDB.img = archivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: archivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;