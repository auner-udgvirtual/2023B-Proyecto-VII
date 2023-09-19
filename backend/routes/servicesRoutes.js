import express from 'express'
import {
    getServices,
    createServices,
    getServiceById,
    updateService,
    deleteService
} from '../controllers/servicesControllers.js'


const router = express.Router()

router.route('/')
    .post(createServices)
    .get(getServices)

router.route('/:id')
    .get(getServiceById)
    .put(updateService)
    .delete(deleteService)

export default router