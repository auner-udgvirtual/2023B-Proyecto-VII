
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import { db } from './config/db.js'
import servicesRoutes from './routes/servicesRoutes.js'

// Variables de entorno
dotenv.config()

// configure app
const app = express()

//leer datos via body
app.use(express.json())

// Conectar a la base de datas
db()

// configurar CORS
const whiteList = [process.env.FRONTEND_URL]

if (process.argv[2] === '--eClient') {
    whiteList.push(undefined)
}

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            // permite conexion
            callback(null, true)
        } else {
            // No permitir conexion
            callback(new Error('Error de CORS'))
        }
    }
}
app.use(cors(corsOptions))

// Define a path
app.use('/api/services', servicesRoutes)

// Define a port
const PORT = process.env.PORT || 4000

// start the app
app.listen(PORT, () => {
    console.log(colors.blue.bold('El servidor se esta ejecutando en el puerto:', PORT))
})
