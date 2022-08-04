import 'dotenv/config' // Para poder usar las variables de entorno directamente.

// Importo y utilizo YARGS
import yargsF from 'yargs/yargs';
const yargs = yargsF(process.argv.slice(2))

const argv = yargs.alias({ p: "port", m: "mode" }).alias({ p: "puerto", m: "modo" }).default({ p: 8080, m: "FORK" }).argv;

// delete argv.$0 //Elimino el atributo por defecto que contiene el nombre del file

import os from 'os'
const numCPUs = os.cpus().length // Calculo qty de núcleos del proc

const MONGO_URL = process.env.MONGO_URL || ''
const PORT = parseInt(argv.port) || 8080
const MODE = argv.mode || 'FORK'
const EXP_TIME = parseInt(process.env.EXP_TIME) || (1000 * 60 * 10)
const NUMCPUS = numCPUs || 1

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER

const MAIL_ADMIN = 'administrador@esdpstore.com'
const PHONE_NUMBER_ADMIN = '+5491162395265'

export { MONGO_URL, PORT, MODE, EXP_TIME, NUMCPUS, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, MAIL_ADMIN, PHONE_NUMBER_ADMIN }