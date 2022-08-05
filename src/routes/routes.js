
import { postCarrito } from '../utils/utils.js'

import { sendEmail } from "../utils/sendEmail.js"

import { MAIL_ADMIN } from '../config/config.js';

import { logger } from '../config/logger.js'; //Importo middlewares que utilizan el logger que configuré

import { passport } from '../auth/auth.js'; //Importo mi passport ya configurado

//Importo y configuro el router
import { Router, json, urlencoded } from 'express';
const router = Router()

//Para leer bien los req.body
router.use(json());
router.use(urlencoded({ extended: true }));

// import compression from 'compression'; //Importo middleware de compresión gzip

//  INDEX
router.get('/', (req, res) => {

    if (req.isAuthenticated()) {
        res.render('main', { username: req.user.name })
    } else {
        res.redirect('/login');
    }
});

//  LOGIN
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('login');
    }
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {

    const result = await postCarrito(req.user ? req.user.email : '')

    if (!result.error) {
        res.redirect('/')
    } else {
        logger.error(result)
        res.status(500).json(result);
    }
});

router.get('/faillogin', (req, res) => res.render('login-error', {}));

//  SIGNUP
router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('signup');
    }
});

// router.post('/signup', infoLogger, passport.authenticate('signup', { failureRedirect: '/failsignup', successRedirect: '/' }));
router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), async (req, res) => {

    // Envío mail al ADMIN con los datos del nuevo user:

    const mailOptions = {
        from: '"ESDP Store!" <store@esdp.com>', // sender address
        to: MAIL_ADMIN,
        subject: "Nuevo Registro!", // Subject line
        text: JSON.stringify(req.user, null, 2), // plain text body
        // html: '<h1 style="color:green">Contenido desde <span style="color:blue">Node</span> Eze lalita</h1>', // html body
    }

    logger.info(await sendEmail(mailOptions))

    // Creo un carrito asociado al nuevo user:

    const result = await postCarrito(req.user ? req.user.email : '')

    if (!result.error) {
        res.redirect('/')
    } else {
        logger.error(result)
        res.status(500).json(result);
    }
})

router.get('/failsignup', (req, res) => res.render('signup-error', {}));

//  LOGOUT
router.get('/logout', (req, res) => {
    let usuario = ''
    if (req.isAuthenticated()) {
        usuario = req.user.name
    }
    req.logout((err) => {
        if (!err) {
            res.render('logout', { username: usuario });
        } else {
            res.redirect('/');
        }
    })
});

//  Maestro Productos
router.get('/maestroproductos', (req, res) => {

    res.render('maestroProductosTemp');
    /*
    if (req.isAuthenticated()) {
        res.render('maestroProductos');
    } else {
        res.redirect('/login');
    }
    */
})

//  Vista Carrito
router.get('/cart', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('cart', { username: req.user.name });
    } else {
        res.redirect('/login');
    }
})

//  User Account
router.get('/useraccount', (req, res) => {

    // Me falta crear la vista HTML aún...

    if (req.isAuthenticated()) {

        const usuario = {
            nombre: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
            fechaNacimiento: req.user.nacimiento.toISOString().split("T")[0],
            direccion: req.user.direccion,
            telefono: req.user.phone
        }
        res.render('useraccount', usuario);
        // res.type('json').send(JSON.stringify(usuario, null, 2))
    } else {
        res.redirect('/login');
    }
})

// check if logged
router.get('/checkAuth', (req, res) => res.json({ auth: req.isAuthenticated() }));

export default router