import { $app } from '#libs/db/dbQueryHelpers'
import { Seller } from '#types/sellers'
import bcrypt from 'bcryptjs'

export async function findUser(email: string) {
    const user = await $app<Seller>`SELECT * FROM sellers WHERE email = ${email}`
    if (!user.ok) {
        return null
    }
    return user.data
}

export async function findUserById(id: string) {
    const user = await $app<Seller>`SELECT * FROM sellers WHERE id = ${id}`
    if (!user.ok) {
        return null
    }
    return user.data
}

export async function matchPassword(seller: Seller, password: string) {
    if (!seller) {
        return false
    }
    return await bcrypt.compare(password, seller.password)
}
