export type SellerPublic = {
    first_name: string
    last_name: string
    phone: number
    email: string
}

export type SellerPrivate = {
    id: string
    password?: string
    corporate_email?: string
    status?: number
    privilege: number
}

export type Seller = SellerPublic & SellerPrivate
