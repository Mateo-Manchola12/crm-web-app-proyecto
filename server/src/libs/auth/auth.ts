import jwt, { JwtPayload } from 'jsonwebtoken'
import { SECRET_JWT_TOKEN } from '#constants/secrets.js'
import { Seller } from '#types/sellers.js'

// Función para generar el JWT
export const generateToken = (user: Seller) => {
    return jwt.sign({ id: user.id }, SECRET_JWT_TOKEN as string, { expiresIn: '1h' })
}

export const verifyToken = (token: string): Promise<JwtPayload>=> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_JWT_TOKEN as string, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded as JwtPayload)
            }
        })
    })
}