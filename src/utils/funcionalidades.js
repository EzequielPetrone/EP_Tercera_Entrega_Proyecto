//Importo DAOS e instancio. 
// import { ProductosDaoMongo } from '../daos/productos/ProductosDaoMongo.js';
import { CarritosDaoMongo } from '../daos/carritos/CarritosDaoMongo.js';
// const contenedorProductos = new ProductosDaoMongo()
const contenedorCarritos = new CarritosDaoMongo()

// Para el alta de un nuevo Carrito
const postCarrito = async (email) => {
    // let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        const cartId = await contenedorCarritos.getCartIdByUserEmail(email)
        if (cartId) {
            return await contenedorCarritos.getById(cartId)
        } else {
            const newId = await contenedorCarritos.save({ userEmail: email, activo: true, productos: [] })
            if (newId) {
                return await contenedorCarritos.getById(newId)
            }
        }
    } catch (error) {
        return null
    }
}

export { postCarrito }