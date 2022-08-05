// ESTE CÓDIGO ES PARA CORRERLO CON NODE/NODEMON YA QUE EN CASO QUE EL MODE LO AMERITE EL CLUSTERING ES MANUAL (con FOREVER también puede aplicar)

// Esto lo hago para adaptar __dirname a ES6 modules...
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Importo dependencias varias. 
import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import passport from 'passport';

import { PORT, MODE, NUMCPUS, EXP_TIME, PASSPORT_SESSION_SECRET } from './src/config/config.js' //Importo variables de config

import { logger, warnLogger } from './src/config/logger.js' //Importo logger que configuré

//Importo Routes
import router from './src/routes/routes.js';
import routerProductos from './src/routes/routerProductos.js';
import routerCarrito from './src/routes/routerCarrito.js';

import cluster from 'cluster'; // Importo cluster

if (MODE == 'CLUSTER' && cluster.isPrimary) {
    logger.info(`PID MASTER: ${process.pid}`)

    // Cuando el modo pasado por args es CLUSTER, el process MASTER lanza los workers, 1 por cada cpu
    for (let i = 0; i < NUMCPUS; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.info(`Worker ${worker.process.pid} died! ${new Date().toLocaleString()}`)
        cluster.fork() //Si un worker muere levanto otro
    })

} else { // Cuando el modo pasado por args es FORK o es un cluster worker uso el código de siempre

    const app = express(); //Seteo Express app

    app.disable('x-powered-by'); // un pequeño seteo de seguridad

    //Seteo HBS views
    app.engine(
        "hbs",
        handlebars.engine({
            extname: ".hbs",
            defaultLayout: 'index.hbs',
            layoutsDir: __dirname + "/src/views/layouts",
            partialsDir: __dirname + "/src/views/partials/",
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            }
        })
    );
    app.set('view engine', 'hbs');
    app.set('views', './src/views');

    //Seteo 'public' como static
    app.use(express.static(__dirname + "/public"));

    //Configuro Middleware de manejo de errores
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).json({ error: err });
    })

    //Configuro session e inicializo passport
    app.use(session({
        secret: PASSPORT_SESSION_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: EXP_TIME
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }))
    app.use(passport.initialize())
    app.use(passport.session())

    //Seteo Routers
    app.use('/', router)
    app.use('/api/productos', routerProductos)
    app.use('/api/carrito', routerCarrito)

    //Gestiono rutas no parametrizadas
    app.use('*', warnLogger, (req, res) => res.status(404).render('routing-error', { originalUrl: req.originalUrl, method: req.method }));

    //Pongo a escuchar al server
    const server = app.listen(PORT, err => {
        if (!err) {
            logger.info(`Server running at PORT: ${server.address().port} (PID:${process.pid})`)
        }
    });

    //Server Error handling
    server.on("error", error => logger.error('Error en el servidor: ' + error))
}