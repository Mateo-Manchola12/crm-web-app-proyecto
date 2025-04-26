import { findUser, matchPassword } from '#controllers/loginController'
import { checkEmail, checkIinputs, createSeller } from '#controllers/signupController'
import { $app } from '#libs/db/dbQueryHelpers'
import { db_app } from '#libs/db/db'
import { Seller } from '#types/sellers'

export async function localLogin(email: string, password: string) {
    const user = await findUser(email)
    if (!user) return { user: null, message: 'Email incorrecto' }
    if (!(await matchPassword(user, password)))
        return { user: null, message: 'Contraseña incorrecta' }
    return { user, message: 'Bienvenido' }
}

interface UserInput {
    first_name: string
    last_name: string
    phone: string
    email: string
    password: string
    [key: string]: unknown
}

export async function localSignup(user: UserInput) {
    try {
        const { result, seller, input } = checkIinputs(user)
        if (!result || !seller) {
            return { user: null, message: `Campo inválido: ${input}` }
        }

        const exists = await checkEmail(seller.email)
        if (exists) {
            return { user: null, message: 'Email ya registrado' }
        }

        const register = await createSeller(seller, user.password)
        if (!register) {
            return { user: null, message: 'Error al crear el vendedor' }
        }

        const data = await $app`INSERT INTO sellers ${db_app?.(register) ?? ''}`
        if (!data.ok) {
            return { user: null, message: 'Error al registrar en la DB' }
        }

        return { user: register as Seller, message: 'Gracias por elegirnos' }
    } catch {
        return { user: null, message: 'Error al realizar el registro' }
    }
}
