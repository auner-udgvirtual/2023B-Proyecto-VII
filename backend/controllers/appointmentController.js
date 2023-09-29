import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import Appointment from "../models/Appointment.js"
import { validateObjectId, handledFoundNotError, formatDate } from '../utils/index.js'
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailCancelAppointment } from '../emails/appointmentEmailService.js'


const createAppointment = async (req, res) => {
    const appointment = req.body
    appointment.user = req.user._id.toString()

    try {
        const newAppointment = new Appointment(appointment)
        const result = await newAppointment.save()
        await sendEmailNewAppointment({
            date: formatDate(result.date),
            time: result.time
        })
        res.status(201).json({
            msg: 'Tu reservación se realizó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const getAppointmentsByDate = async (req, res) => {
    const { date } = req.query
    const newDate = parse(date, 'dd/MM/yyyy', new Date())

    if (!isValid(newDate)) {
        const error = new Error('Fecha no valida')
        return res.status(400).json({ msg: error.message })
    }

    const isoDate = formatISO(newDate)

    const appointments = await Appointment.find({
        date: {
            $gte: startOfDay(new Date(isoDate)),
            $lte: endOfDay(new Date(isoDate))
        }
    }).select('time')

    res.json(appointments)
}

const getAppointmentById = async (req, res) => {
    const { id } = req.params

    // validar por object id
    if (validateObjectId(id, res)) return

    // validar que exista

    const appointment = await Appointment.findById(id).populate('services')

    if (!appointment) {
        return handledFoundNotError('La Cita no existe', res)
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tiene los permisos')
        return res.status(403).json({ msg: error.message })
    }

    // retornar la cita
    res.json(appointment)
}

const updateAppointment = async (req, res) => {

    const { id } = req.params

    // validar por object id
    if (validateObjectId(id, res)) return

    // validar que exista

    const appointment = await Appointment.findById(id).populate('services')

    if (!appointment) {
        return handledFoundNotError('La Cita no existe', res)
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tiene los permisos')
        return res.status(403).json({ msg: error.message })
    }

    const { date, time, totalAmount, services } = req.body

    appointment.date = date
    appointment.time = time
    appointment.totalAmount = totalAmount
    appointment.services = services


    try {
        const result = await appointment.save()
        await sendEmailUpdateAppointment({
            date: formatDate(result.date),
            time: result.time
        })
        res.json({ msg: 'Cita Actualizada Correctamente' })
    } catch (error) {
        console.log(error)
    }
}

const deleteAppointment = async (req, res) => {

    const { id } = req.params

    // validar por object id
    if (validateObjectId(id, res)) return

    // validar que exista

    const appointment = await Appointment.findById(id).populate('services')

    if (!appointment) {
        return handledFoundNotError('La Cita no existe', res)
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tiene los permisos')
        return res.status(403).json({ msg: error.message })
    }

    try {
        const result = await appointment.deleteOne()
        await sendEmailCancelAppointment({
            date: formatDate(result.date),
            time: result.time
        })
        res.json({ msg: 'Cita Cancelada Exitosamente' })
    } catch (error) {
        console.log(error)
    }
}


export {
    createAppointment,
    getAppointmentsByDate,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} 