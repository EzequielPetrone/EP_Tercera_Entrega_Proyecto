import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
    userEmail: { type: String, max: 100 },
    activo: { type: Boolean },
    productos: []
},
    { strict: false },
    { timestamps: true }
)

const carritosModel = mongoose.model('carritosProyecto', carritoSchema)

export { carritosModel } 