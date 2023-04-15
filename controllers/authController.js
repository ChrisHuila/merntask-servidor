const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, resp) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores: errores.array()})
    }
    // Extraer el email y el password
    const { email, password }  = req.body;
    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario) {
            return resp.status(400).json({msg: 'El usuario no existe'})
        }
        // revisar el password
        const passCorrecto = bcryptjs.compareSync(password, usuario.password);
        if(!passCorrecto){
            return resp.status(400).json({msg: 'Password Incorrecto'});
        }
        
    
        // Si todo es correcto crear y firmar el JWT
        const payload = {
            usuario: usuario.id,

        };
        // Firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            // expiresIn:3600 // 1 hr
            expiresIn:'30d' // 30 dias
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            resp.json({token})
        }); 

    } catch (error) {
        console.log(error);
    }
} 
// Obtiene el usuario autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario)
        res.json({usuario})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}