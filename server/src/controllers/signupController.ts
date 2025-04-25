import { Seller, SellerPublic } from '#types/sellers'
import { createPasswordHash } from '#utils/password'
import checkInput from '#utils/checkInput'
import { getRandomId } from '#utils/getRandomId.js'
import { $app } from '#libs/db/dbQueryHelpers.js'

/**
 * Verifica los datos de entrada proporcionados para registrar un vendedor.
 *
 * @param data - Objeto que contiene los datos del vendedor a validar.
 * @param data.first_name - Nombre del vendedor. Debe ser una cadena no vacía, con un máximo de 40 caracteres y solo letras y espacios.
 * @param data.last_name - Apellido del vendedor. Debe ser una cadena no vacía, con un máximo de 40 caracteres y solo letras y espacios.
 * @param data.phone - Teléfono del vendedor. Debe ser una cadena con un mínimo de 9 y un máximo de 16 caracteres, permitiendo un prefijo opcional "+" seguido de números.
 * @param data.email - Correo electrónico del vendedor. Debe ser una cadena válida con un formato de correo electrónico.
 * @param data.password - Contraseña del vendedor. Debe ser una cadena entre 8 y 22 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.
 * @returns Un objeto que indica si la validación fue exitosa, el vendedor validado (si es válido) y el nombre del campo que falló (si no es válido).
 */
export function checkIinputs(data: {
    first_name: string
    last_name: string
    phone: string
    email: string
    password?: string
    [key: string]: unknown
}): { result: boolean; seller: SellerPublic | null; input?: string } {
    const { first_name, last_name, phone, email, password } = data

    const results = {
        first_name: checkInput(first_name, {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 40,
            regexp: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
        }),
        last_name: checkInput(last_name, {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 40,
            regexp: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
        }),
        phone: checkInput(phone, {
            required: true,
            type: 'string',
            minLength: 9,
            maxLength: 16,
            regexp: /^\+?[0-9]{9,15}$/,
        }),
        email: checkInput(email, {
            required: true,
            type: 'string',
            minLength: 5,
            maxLength: 50,
            regexp: /[^@\s]+@[^@\s]+\.[^@\s]+/,
        }),
    }

    let checkpassword = true
    if (password) {
        checkpassword = checkInput(password, {
            required: true,
            type: 'string',
            minLength: 8,
            regexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        })
    }

    const result = Object.values(results).every((res) => res) && checkpassword

    if (!result) {
        return {
            result: false,
            seller: null,
            input: Object.entries(results).find(([key, value]) => !value)?.[0],
        }
    }
    const seller: SellerPublic = {
        first_name,
        last_name,
        phone: Number(phone.replace('+', '')),
        email,
    }

    return { result: true, seller }
}

/**
 * Verifica si un correo electrónico existe en la base de datos de vendedores.
 *
 * @param email - La dirección de correo electrónico a verificar.
 * @returns Una promesa que se resuelve en `true` si el correo existe, de lo contrario `false`.
 */
export async function checkEmail(email: string): Promise<boolean> {
    const { data } = await $app<Seller>`SELECT * FROM sellers WHERE email = ${email}`
    return !!data
}

/**
 * Crea un nuevo objeto de vendedor con los datos proporcionados y una contraseña encriptada.
 *
 * @param data - Un objeto que contiene la información pública del vendedor.
 * @param password - La contraseña en texto plano que será encriptada y almacenada.
 * @returns Un nuevo objeto `Seller` con un ID único, privilegio y estado predeterminados,
 *          y la contraseña encriptada.
 */
export async function createSeller(data: SellerPublic, password: string): Promise<Seller> {
    const passwordHash = await createPasswordHash(password)
    return {
        ...data,
        id: getRandomId(8),
        privilege: 1,
        status: 0,
        password: passwordHash,
    }
}
