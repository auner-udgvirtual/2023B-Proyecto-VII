import User from "../models/User.js"
import { sendEmailVerification, sendEmailPasswordReset } from "../emails/authEmailService.js"
import { generateJWT, uniqueId } from "../utils/index.js"

const register = async (req, res) => {

    // Valida todos los campos
    if (Object.values(req.body).includes('')) {
        const error = new Error('Todos los campos son obligatorios')
        return res.status(400).json({ msg: error.message })
    }

    const { email, password, name } = req.body
    // Evitar registros duplicados
    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('Usuario ya registrado')
        return res.status(302).json({ msg: error.message })
    }

    // Validar la extension del password
    if (password.trim().length < process.env.MIN_PASSWORD_LENGHT) {
        const error = new Error(`El password debe contener ${process.env.MIN_PASSWORD_LENGHT} caracteres.`)
        return res.status(400).json({ msg: error.message })
    }

    try {
        const user = new User(req.body)
        const result = await user.save()

        sendEmailVerification(result)

        res.status(201).json({
            msg: 'El usuario se creo correctamente, revisa tu email'
        })
    } catch (error) {
        console.error(error)
    }
}

const verifyAccount = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ token })
    if (!user) {
        const error = new Error('Hubo un error, token no valido')
        return res.status(401).json({ msg: error.message })
    }

    // si el token es valido, confirmar la cuenta
    try {
        user.verified = true
        user.token = ''
        await user.save()
        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.error(error)
    }
}

const login = async (req, res) => {
    // Valida todos los campos
    if (Object.values(req.body).includes('')) {
        const error = new Error('Todos los campos son obligatorios')
        return res.status(400).json({ msg: error.message })
    }

    const { email, password } = req.body

    // revisar que el usuario exista
    const user = await User.findOne({ email })

    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    // revisar si el usuario confirmo su cuenta
    if (!user.verified) {
        const error = new Error('Tu cuenta no ha sido verificada aún')
        return res.status(401).json({ msg: error.message })
    }

    // comprobar el password
    if (await user.checkPassword(password)) {
        const token = generateJWT(user._id)
        res.json({ token })
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(401).json({ msg: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body

    // Comprobar si existe el usuario
    const user = await User.findOne({ email })

    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    try {
        user.token = uniqueId()
        const result = await user.save()

        await sendEmailPasswordReset({
            name: result.name,
            email: result.email,
            token: result.token,
        })

        res.json({
            msg: 'Hemos enviado un email con las instrucciones'
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyPasswordResetToken = async (req, res) => {
    const { token } = req.params

    const isValidToken = await User.findOne({ token })

    if (!isValidToken) {
        const error = new Error('Hubo un error, Token no válido')
        return res.status(400).json({ msg: error.message })
    }

    res.json({ msg: 'Token Válido' })
}

const updatePassword = async (req, res) => {
    const { password } = req.body
    const { token } = req.params

    const user = await User.findOne({ token })

    if (!user) {
        const error = new Error('Hubo un error, Token no válido')
        return res.status(400).json({ msg: error.message })
    }

    try {
        user.token = ''
        user.password = password
        await user.save()
        res.json({
            msg: 'Password modificado correctamente'
        })

    } catch (error) {
        console.log(error)
    }

}

const user = async (req, res) => {
    const { user } = req
    res.json(user)
}
const admin = async (req, res) => {
    const { user } = req

    if (!user.admin) {
        const error = new Error('Acción no válida')
        return res.status(403).json({ msg: error.message })
    }

    res.json(user)
}

export {
    register,
    verifyAccount,
    login,
    forgotPassword,
    verifyPasswordResetToken,
    updatePassword,
    user,
    admin
}