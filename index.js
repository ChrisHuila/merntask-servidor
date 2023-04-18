const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();
// app.use(express.json());

// Conectar a la DB
conectarDB()
// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({extended: true}));

// Puerto de la app
const port = process.env.PORT || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// arrancar la app
app.listen(port, "0.0.0.0" ,() =>{
    console.log(" el servidor funciana en el puerto " + port );
})