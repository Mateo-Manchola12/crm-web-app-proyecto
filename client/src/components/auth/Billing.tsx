import { $ } from '@/js/dom-selector'
import { useEffect, useState } from 'react'

function getValues(price: number, discount: number, billing: number) {
    const monthly = price - (price * discount) / 100
    const total = monthly * billing
    return { monthly, total }
}

/**
 * Componente `Billing` que calcula y muestra el precio mensual y el total
 * basado en las opciones de facturación seleccionadas.
 *
 * @param price - Precio base inicial.
 * @param billingOptions - Opciones de facturación disponibles, cada una con un valor, etiqueta y descuento.
 *
 * @remarks
 * Este componente utiliza un `useEffect` para manejar los cambios en las opciones
 * de facturación seleccionadas por el usuario. Calcula el precio mensual y el total
 * aplicando el descuento correspondiente.
 *
 * @example
 * ```tsx
 * const billingOptions = [
 *   { value: '12', label: '1 año', discount: '10' },
 *   { value: '24', label: '2 años', discount: '20' },
 * ];
 *
 * <Billing price={100} billingOptions={billingOptions} />
 * ```
 */
export default function Billing({
    price,
    billingOptions,
}: {
    price: number
    billingOptions: { value: string; label: string; discount: string }[]
}) {
    const [total, setTotal] = useState(price)
    const [monthly, setMonthly] = useState(price)
    const [billing, setBilling] = useState(48)

    useEffect(() => {
        const select = $<HTMLSelectElement>('#Billing')
        if (!select) return

        const handleChange = () => {
            const billing = select.value ? parseInt(select.value) : 0
            const discount = parseInt(
                billingOptions.find((option) => option.value === select.value)?.discount || '0',
            )

            const { monthly, total } = getValues(price, discount, billing)
            setTotal(total)
            setMonthly(monthly)
            setBilling(billing)
        }

        select.value = billing.toString()
        handleChange()

        select.addEventListener('change', handleChange)
        return () => {
            select.removeEventListener('change', handleChange)
        }
    }, [billingOptions, price])

    return (
        <>
            <p className="w-full text-lg">${monthly.toFixed(2)}/mes</p>
            {price != monthly && (
                <p className="align-middle text-sm font-light text-gray-500">
                    <s>${price}/mes</s>
                </p>
            )}
            <p className="mt-auto inline-flex w-full items-center text-lg">
                <strong className="mr-auto"> SubTotal:</strong>
                {price * billing != total && (
                    <span className="align-middle text-sm font-light text-gray-500">
                        <s>${price * billing}</s>
                    </span>
                )}
                ${total.toFixed(2)}
            </p>
        </>
    )
}
