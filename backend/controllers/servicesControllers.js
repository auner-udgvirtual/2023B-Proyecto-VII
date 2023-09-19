import Services from '../models/Services.js'
import { validateObjectId, handledFoundNotError } from '../utils/index.js'


const getServices = async (req, res) => {
    try {
        const services = await Services.find()
        res.json(services)
    } catch (error) {
        console.log(error)
    }
}

const createServices = async (req, res) => {
    if (Object.values(req.body).includes('')) {
        const error = new Error('Todos los campos son obligatorios')

        return res.status(400).json({
            msg: error.message
        })
    }

    try {
        const service = new Services(req.body)
        await service.save()

        res.status(201).json({
            msg: 'El Servicio se creo correctamente'
        })
    } catch (error) {
        console.log(error)
    }


}

const getServiceById = async (req, res) => {
    const { id } = req.params

    // validar un object id
    if (validateObjectId(id, res)) return

    // validar que existe
    const service = await Services.findById(id)
    if (!service) {
        return handledFoundNotError('El Servicio no existe', res)
    }

    // mostrar el servicio
    res.json(service)
}

const updateService = async (req, res) => {
    const { id } = req.params

    // validar un object id
    if (validateObjectId(id, res)) return

    // validar que existe
    const service = await Services.findById(id)
    if (!service) {
        return handledFoundNotError('El Servicio no existe', res)
    }

    service.name = req.body.name || service.name
    service.price = req.body.price || service.price

    try {
        await service.save()
        res.json({
            msg: 'El servicio se actualizó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteService = async (req, res) => {
    const { id } = req.params

    // validar un object id
    if (validateObjectId(id, res)) return

    // validar que existe
    const service = await Services.findById(id)
    if (!service) {
        return handledFoundNotError('El Servicio no existe', res)
    }

    try {
        await service.deleteOne()
        res.json({
            msg: 'El servicio se eliminó correctamente.'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    getServices,
    createServices,
    getServiceById,
    updateService,
    deleteService
}