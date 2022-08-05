
//Function para validar si un objeto es un Producto válido
const isProducto = (obj) => {
    if (obj &&
        obj.nombre && typeof (obj.nombre) == 'string' &&
        obj.descripcion && typeof (obj.descripcion) == 'string' &&
        obj.codigo && typeof (obj.codigo) == 'string' &&
        obj.thumbnail && typeof (obj.thumbnail) == 'string' &&
        obj.precio && typeof (obj.precio) == 'number' &&
        obj.stock && typeof (obj.stock) == 'number' &&
        Object.keys(obj).length == 6) {
        return true
    } else {
        return false
    }
}

export { isProducto }