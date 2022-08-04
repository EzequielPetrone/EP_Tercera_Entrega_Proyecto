//Importo Clase Contenedor para luego extender de ella
import ContenedorMongo from '../../contenedores/ContenedorMongo.js';

// Importo Model del schema 'productos' 
import { productosModel } from '../../models/productos.js'

import { logger } from '../../config/logger.js' //Importo logger que configuré

//DAO que extiende de clase Contenedor
class ProductosDaoMongo extends ContenedorMongo {

    constructor() {
        super(productosModel);
    }

    async actualizarStock(id, qty) {
        let prod = await this.getById(id)
        //Fundamental validar que no se intente restar más cantidad del stock disponible!
        if (prod && prod.stock + qty >= 0) {
            prod.stock += qty
            return await this.editById(id, prod) //Esto retorna true cuando se edita correctamente
        } else {
            logger.error('No es posible actualizar stock del producto con id', id)
            return false
        }
    }
}

export { ProductosDaoMongo }