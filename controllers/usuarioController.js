const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, resp) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return resp.status(400).json({errores: errores.array()})
    }
    // Extraer email y password
    const {email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({email}); 

        if(usuario){
            return resp.status(400).json({msg: "El usuario ya existe"});
        }
        //  crea el nuevo usuario
        usuario = new Usuario(req.body)
        // hashear el password
        const salt = bcryptjs.genSaltSync(10);
       
        usuario.password = bcryptjs.hashSync(password, salt);
        // Guardar usuario
        await usuario.save()

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            } 
        };
        // Firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn:3600 // 1 hr
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            resp.json({token})
        });
      
    } catch (error) {
        // console.log(error + " desde  controller");
        resp.status(400).send('hubo un error')
    }
}