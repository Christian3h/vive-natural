import express from 'express'
import path from 'path'
import passport from './config/passport.js'
import dotenv from 'dotenv'

import { fileURLToPath } from 'url';

// Obtener la ruta del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaGlobal = __dirname;

// esto es un comentario 



dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// Middleware de sesión (debe estar antes de passport.initialize())
import { sessionMiddleware } from './middlewares/loginMiddlewares.js'
import { helmetMiddleware } from './config/helmet.js'

app.use(sessionMiddleware)
app.use(helmetMiddleware);

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://www.gstatic.com https://www.googleapis.com;");
    next();
  });
  

// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())

// esto es un comentario jeje xd 

// Configuración del motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(rutaGlobal, 'views'));
// Configuración de carpetas públicas
app.use(express.static(path.join(rutaGlobal, '..', 'public')))

// Configuración JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// rutas 
import usuarioRoutes from './routes/usuarioRoutes.js'
import sesionRoutes from './routes/sesionRoutes.js'
import apiRoutes from './routes/api/api.js'

app.use('/', usuarioRoutes)
app.use('/sesion', sesionRoutes)
app.use('/api', apiRoutes)

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
