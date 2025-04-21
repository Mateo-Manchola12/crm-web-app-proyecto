import { Seller, SellerPublic } from '#types/sellers'
import { createPasswordHash } from '#utils/password'
import checkInput from '#utils/checkInput'
import { getRandomId } from '#utils/getRandomId.js'
import { $app } from '#libs/dbQueryHelpers.js'

export function checkIinputs(data: {
    first_name: string
    last_name: string
    phone: string
    email: string
    password: string
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
        password: checkInput(password, {
            required: true,
            type: 'string',
            minLength: 8,
            maxLength: 22,
            regexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,22}$/,
        }),
    }

    const result = Object.values(results).every((res) => res)

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

export async function checkEmail(email: string): Promise<boolean> {
    const { data } = await $app<Seller>`SELECT * FROM sellers WHERE email = ${email} `
    if (data) return true
    return false
}

export function createSeller(data: SellerPublic, password: string): Seller {
    const passwordHash = createPasswordHash(password)
    const seller: Seller = {
        ...data,
        id: getRandomId(8),
        privilege: 1,
        status: 0,
        password: passwordHash,
    }

    return seller
}
