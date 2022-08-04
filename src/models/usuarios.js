import mongoose from "mongoose";
import { MONGO_URL } from '../config/config.js'

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  name: { type: String, required: true, max: 100 },
  direccion: { type: String, required: true, max: 100 },
  nacimiento: { type: Date, required: true },
  phone: { type: String, required: true, max: 50 },
  avatar: { type: String, required: true, max: 200 }
})

export default mongoose.model('usuariosProyecto', UsuarioSchema)