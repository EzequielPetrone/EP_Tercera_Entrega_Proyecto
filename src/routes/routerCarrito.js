//Importo DAOS e instancio. 
import { ProductosDaoMongo } from '../daos/productos/ProductosDaoMongo.js';
import { CarritosDaoMongo } from '../daos/carritos/CarritosDaoMongo.js';
const contenedorProductos = new ProductosDaoMongo()
const contenedorCarritos = new CarritosDaoMongo()

import { sendEmail } from "../utils/sendEmail.js"

import { sendWapp } from '../utils/sendWapp.js';

import { MAIL_ADMIN, PHONE_NUMBER_ADMIN } from '../config/config.js';

import { logger } from '../config/logger.js'; //Importo middlewares que utilizan el logger que configuré

import { postCarrito } from '../utils/funcionalidades.js'

//Importo express y configuro Routers
import { Router, json, urlencoded } from "express";
const routerCarrito = Router()

//Configuro para poder leer sin problemas los req.body
routerCarrito.use(json())
routerCarrito.use(urlencoded({ extended: true }))

//GET '/api/carrito' -> devuelve array con todos los carritos registrados.
routerCarrito.get("/", async (req, res) => {
    //TODO: es un expuesto de seguridad que cualquiera pueda hacer este get...
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        res.json(await contenedorCarritos.getAll())
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

// POST /api/carrito
routerCarrito.post("/", async (req, res) => {
    let errCode = 0;
    try {
        const result = await postCarrito(req.isAuthenticated() && req.user ? req.user.email : '')
        if (result) {
            res.json(result)
        } else {
            errCode = -7
            throw 'No se pudo crear el carrito'
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//DELETE '/api/carrito/:id' -> elimina un carrito según su id (pero antes devuelve stock de productos)
routerCarrito.delete("/:id", async (req, res) => {

    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error

    const id = req.params.id == 'auth' && req.isAuthenticated() ? await contenedorCarritos.getCartIdByUserEmail(req.user.email) : req.params.id

    try {
        // const id = req.params.id
        const carrito = await contenedorCarritos.getById(id)
        if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

            for (const p of carrito.productos) {
                //Por cada producto dentro del array del carrito lo que hago es devolver el stock
                await contenedorProductos.actualizarStock(p.id, p.stock)
            }
            await contenedorCarritos.deleteById(id)
            res.json({ ok: `Eliminado carrito con id ${id}` })

        } else {
            errCode = -8
            throw `Carrito con id ${id} NO encontrado`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//GET '/api/carrito/:id/productos' -> devuelve productos de un carrito según su id.
routerCarrito.get("/:id/productos", async (req, res) => {
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    const cartId = req.params.id == 'auth' && req.isAuthenticated() ? await contenedorCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
    try {
        const carrito = await contenedorCarritos.getById(cartId)
        if (carrito && carrito.productos) {
            res.json(carrito.productos)
        } else {
            errCode = -8
            throw `Carrito con id ${cartId} NO encontrado`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})


//POST '/api/carrito/:id/productos' -> Incorpora producto a carrito según su id.
routerCarrito.post("/:id/productos", async (req, res) => {

    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error

    const id = req.params.id == 'auth' && req.isAuthenticated() ? await contenedorCarritos.getCartIdByUserEmail(req.user.email) : req.params.id
    //En mi diseño el body que se recibe del Front es un objeto con la siguiente estructura: {idProd, qty}
    //es decir, el id del producto en el contenedor de productos y la cantidad a agregar en el carrito
    try {
        const { idProd, qty } = req.body
        if (idProd && qty > 0) { //Primero valido el body del request recibido

            // const id = req.params.id //Tomo el id del Carrito de los params del req
            const carrito = await contenedorCarritos.getById(id)

            if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

                if (await contenedorProductos.actualizarStock(idProd, - qty)) { //Valido que se pueda actualizar el stock del maestro de productos según la qty recibida

                    const index = carrito.productos.findIndex(p => p.id == idProd)
                    if (index >= 0) {
                        //Si ya existe el producto en el carrito le sumo la qty deseada
                        carrito.productos[index].stock += qty

                    } else { //Sino lo agrego como nuevo elemento
                        const prod = await contenedorProductos.getById(idProd)
                        //Me traigo el producto completo del maestro pero obviamente lo que guardo en el carrito como stock es la qty solicitada por el cliente (y no el stock disponible total)
                        prod.stock = qty
                        carrito.productos.push(prod)
                    }
                    await contenedorCarritos.editById(id, carrito) //Sobreescribo el carrito editado
                    res.json({ ok: `${qty} unidades del producto con id ${idProd} agregadas al carrito con id ${id}` })

                } else {
                    errCode = -9
                    throw `No puede actualizarse el stock del producto con id ${idProd}. Carrito sigue igual`
                }
            } else {
                errCode = -8
                throw `Carrito con id ${id} NO encontrado`
            }
        } else {
            errCode = -10
            throw `Bad Request Body. Estructura esperada: {idProd, qty}`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error })
    }
})


//DELETE '/api/carrito/:id/productos/:id_prod' -> elimina un producto de un carrito según sus ids (pero antes devuelve stock de productos)
routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {

    const id = req.params.id == 'auth' && req.isAuthenticated() ? await contenedorCarritos.getCartIdByUserEmail(req.user.email) : req.params.id

    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        // const { id, id_prod } = req.params
        const id_prod = req.params.id_prod

        const carrito = await contenedorCarritos.getById(id)
        if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

            const index = carrito.productos.findIndex(p => p.id == id_prod)
            if (index >= 0) {
                //Si existe el producto dentro del carrito lo primero que hago es devolver su stock y después lo elimino
                await contenedorProductos.actualizarStock(id_prod, carrito.productos[index].stock)

                carrito.productos.splice(index, 1)

                await contenedorCarritos.editById(id, carrito) //Sobreescribo el carrito editado

                res.json({ ok: `Eliminado del carrito con id ${id} el producto con id ${id_prod}` })

            } else {
                errCode = -11
                throw `Producto con id ${id_prod} NO encontrado dentro del carrito con id ${id}`
            }
        } else {
            errCode = -8
            throw `Carrito con id ${id} NO encontrado`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//POST '/api/carrito/:id/checkout' -> CHECKOUT!
routerCarrito.post("/:id/checkout", async (req, res) => {

    const cartId = req.params.id == 'auth' && req.isAuthenticated() ? await contenedorCarritos.getCartIdByUserEmail(req.user.email) : req.params.id

    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        const result = await contenedorCarritos.checkout(cartId)
        if (result) {

            // Envío mails relacionados con el checkout:

            const notifText = 'Pedido finalizado! Gracias!\n' + JSON.stringify(result, null, 2)

            // En realidad habría que armar bien los cuerpos de los mails y de los mensajes de WhatsApp, por cuestiones de tiempo lo dejo así...

            const mailOptions = {
                from: '"ESDP Store!" <store@esdp.com>', // sender address
                to: req.user.email,
                bcc: MAIL_ADMIN, //con copia oculta
                subject: `Nuevo pedido de ${req.user.name} <${req.user.email}>`, // Subject line
                text: notifText, // plain text body
                // html: '<h1 style="color:green">Contenido desde <span style="color:blue">Node</span></h1>', // html body
            }

            sendEmail(mailOptions).then(resp => logger.info(resp))

            // Envío mensajes de WhatsApp:

            sendWapp([PHONE_NUMBER_ADMIN, req.user.phone], notifText).then(resp => logger.info(resp))

            // Al cerrar exitosamente el carrito en cuestión, vuelvo a asignarle un nuevo carrito abierto vacío al user.

            const response = await postCarrito(req.isAuthenticated() && req.user ? req.user.email : '')

            if (response) {
                res.json(req.user)
            } else {
                errCode = -32
                throw `No se pudo crear nuevo carrito al checkout`
            }
        } else {
            errCode = -31
            throw `No se pudo hacer el checkout del Carrito con id ${cartId}`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

export default routerCarrito