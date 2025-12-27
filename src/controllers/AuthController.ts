import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { transporter } from "../config/nodemailer"
import { AuthEmail } from "../emails/AutEmail"
import { promises } from "nodemailer/lib/xoauth2"

export class AuthController {

    static createAccount = async (req:Request, res: Response) => {
        try {
            const {password, email} = req.body

            // Prevenir duplicados
            const userExists = await User.findOne({email}) 
            if(userExists) {
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error: error.message})
            }

            // Crea un usuario
            const user = new User(req.body)

            // Hash Password
            user.password = await hashPassword(password)

            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            // Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req:Request, res: Response) => {
        try {
            
            const {token} = req.body

            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Cuenta confirmada correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req:Request, res: Response) => {
        try {
            
            const {email, password} = req.body
            const user = await User.findOne({email})

            // Validar si el usuario existe
            if(!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({error: error.message})
            }

            // Validar que la cuenta este confirmada
            if(!user.confirmed) {

                // Generar un nuevo token para mandarlo
                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                await token.save()

                // Enviar Email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion')
                return res.status(401).json({error: error.message})
            }

            // Validar la contraseña este correcta
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('Contraseña Incorrecta')
                return res.status(401).json({error: error.message})
            }

            res.send('Autenticado')


        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req:Request, res: Response) => {
        try {
            const { email } = req.body

            // Ver si el usuario existe
            const user = await User.findOne({email}) 
            if(!user) {
                const error = new Error('El usuario no esta registrado')
                return res.status(404).json({error: error.message})
            }

            if(user.confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                return res.status(403).json({error: error.message})
            }

            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            // Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Se envio un nuevo Token a tu e-mail')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req:Request, res: Response) => {
        try {
            const { email } = req.body

            // Ver si el usuario existe
            const user = await User.findOne({email}) 
            if(!user) {
                const error = new Error('El usuario no esta registrado')
                return res.status(404).json({error: error.message})
            }

            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            await token.save()

            // Enviar Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Se enviaron las instrucciones a tu correo')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}
