import { createTransport } from '../config/nodemailer.js'


export async function sendEmailVerification({ name, email, token }) {
    const transporter = createTransport(
        process.env.NODEMAILER_HOST,
        process.env.NODEMAILER_PORT,
        process.env.NODEMAILER_USER,
        process.env.NODEMAILER_PASS,

    )

    // enviar el email
    const info = await transporter.sendMail({
        from: 'AppSalon <emailservice@appsalon.com>',
        to: email,
        subject: 'AppSalon - Confirma tu cuenta',
        text: 'Favor de confirmar tu cuenta',
        html: `
        <h1>AppSalon</h1>
        <p>Hola ${name}, confirma tu cuenta en AppSalon</p>
        <p>Tu cuenta está casi preparada, solo debes confirmarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>


        `
    })

    console.log('Email enviado!', info.messageId)
}

export async function sendEmailPasswordReset({ name, email, token }) {
    const transporter = createTransport(
        process.env.NODEMAILER_HOST,
        process.env.NODEMAILER_PORT,
        process.env.NODEMAILER_USER,
        process.env.NODEMAILER_PASS,

    )

    // enviar el email
    const info = await transporter.sendMail({
        from: 'AppSalon <emailservice@appsalon.com>',
        to: email,
        subject: 'AppSalon - Reestablece tu password',
        text: 'AppSalon - Reestablece tu password',
        html: `
        <h1>AppSalon</h1>
        <p>Hola ${name}, has solicitado reestabler tu password</p>
        <p>Sigue el siente enlace para generar un nuevo password:</p>
        <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Reestabler password</a>
        <p>Si tu no solicitaste esto, puedes ignorar este mensaje</p>


        `
    })

    console.log('Email enviado!', info.messageId)
}