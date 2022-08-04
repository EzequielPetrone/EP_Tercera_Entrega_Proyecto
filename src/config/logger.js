import winston from 'winston'; // Importo Winston

const logger = winston.createLogger({
    // timeStamp: 'lala',
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ],
})

const infoLogger = (req, res, next) => { //Creo middleware a utilizar en las rutas exitosas para loguear info
    logger.info(`Successful Request ${req.method} a la ruta: ${req.originalUrl}`)
    next()
}

const warnLogger = (req, res, next) => { //Creo middleware a utilizar en rutas no implementadas para loguear warn
    logger.warn(`Fail Request ${req.method} a la ruta: ${req.originalUrl} (No implementada)`)
    next()
}

export { logger, infoLogger, warnLogger }