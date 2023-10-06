import { createTransport } from '../config/nodemailer.js'


export async function sendEmailNewAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.NODEMAILER_HOST,
        process.env.NODEMAILER_PORT,
        process.env.NODEMAILER_USER,
        process.env.NODEMAILER_PASS,

    )

    // enviar el email
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: 'AppSalon - Nueva Cita',
        text: 'AppSalon -  Nueva Cita',
        html: `
        <h1>AppSalon</h1>
        <p>Hola Admin, tienes una nueva cita</p>
        <p>La cita será el día: ${date} a las ${time} horas.</p>
        `
    })

    console.log('Email enviado!', info.messageId)
}

export async function sendEmailUpdateAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.NODEMAILER_HOST,
        process.env.NODEMAILER_PORT,
        process.env.NODEMAILER_USER,
        process.env.NODEMAILER_PASS,

    )

    // enviar el email
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: 'AppSalon - Cita Actualizada',
        text: 'AppSalon -  Cita Actualizada',
        html: `
        <h1>AppSalon</h1>
        <p>Hola Admin, un usuario ha modificado una cita</p>
        <p>La nueva cita será el día: ${date} a las ${time} horas.</p>
        `
    })

    console.log('Email enviado!', info.messageId)
}

export async function sendEmailCancelAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.NODEMAILER_HOST,
        process.env.NODEMAILER_PORT,
        process.env.NODEMAILER_USER,
        process.env.NODEMAILER_PASS,

    )

    // enviar el email
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: 'AppSalon - Cita Cancelada',
        text: 'AppSalon -  Cita Cancelada',
        html: `
        <h1>AppSalon</h1>
        <p>Hola Admin, un usuario ha cancelado una cita</p>
        <p>La cita estaba programada para: ${date} a las ${time} horas.</p>
        `
    })

    console.log('Email enviado!', info.messageId)
}
