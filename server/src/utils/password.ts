import bcrypt from 'bcryptjs'

export async function createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}
