import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, max: 50 },
    descripcion: { type: String, required: true, max: 100 },
    codigo: { type: String, required: true, max: 10, unique: true },
    thumbnail: { type: String, required: true, max: 500 },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
},
    { strict: false },
    { timestamps: true }
)

const productosModel = mongoose.model('productosProyecto', productoSchema)

export { productosModel } 