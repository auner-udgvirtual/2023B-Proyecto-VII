
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import { db } from './config/db.js'
import servicesRoutes from './routes/servicesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Variables de entorno
dotenv.config()

// configure app
const app = express()

//leer datos via body
app.use(express.json())

// Conectar a la base de datas
db()

// configurar CORS
// const whiteList = [process.env.FRONTEND_URL, 'https://appsalon-frontend.onrender.com']

// if (process.argv[2] === '--eClient') {
//     whiteList.push(undefined)
// }

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whiteList.includes(origin) || !origin) {
//             // permite conexion
//             callback(null, true)
//         } else {
//             // No permitir conexion
//             callback(new Error('Error de CORS'))
//         }
//     }
// }
// app.use(cors(corsOptions))
app.use(cors())

// Define a path
app.use('/api/services', servicesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/users', userRoutes)

// Define a port
const PORT = process.env.PORT || 4000

// start the app
app.listen(PORT, () => {
    console.log(colors.blue.bold('El servidor se esta ejecutando en el puerto:', PORT))
})
