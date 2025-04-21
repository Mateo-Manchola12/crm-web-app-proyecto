type ValidatorOptions = {
    required?: boolean
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array'
    regexp?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    enum?: unknown[]
    custom?: (value: unknown) => boolean
}

/**
 * Valida un valor dado según las opciones especificadas.
 *
 * @param value - El valor a validar. Puede ser de cualquier tipo.
 * @param options - Opciones de validación que definen las reglas a aplicar.
 *
 * @property options.required - Indica si el valor es obligatorio. Si es `true`, el valor no puede ser `null` ni `undefined`.
 * @property options.type - Especifica el tipo esperado del valor (por ejemplo, 'string', 'number', 'array', etc.).
 * @property options.enum - Una lista de valores permitidos. El valor debe coincidir con uno de los elementos de esta lista.
 * @property options.regexp - Una expresión regular que el valor debe cumplir si es una cadena de texto.
 * @property options.minLength - Longitud mínima permitida para cadenas de texto.
 * @property options.maxLength - Longitud máxima permitida para cadenas de texto.
 * @property options.min - Valor numérico mínimo permitido.
 * @property options.max - Valor numérico máximo permitido.
 * @property options.custom - Una función personalizada que recibe el valor y devuelve un booleano indicando si es válido.
 *
 * @returns `true` si el valor cumple con todas las reglas de validación especificadas en las opciones, de lo contrario, `false`.
 */
export default function (value: unknown, options: ValidatorOptions): boolean {
    if (options.required && (value === null || value === undefined)) {
        return false
    }

    if (value === null || value === undefined) return true

    if (options.type) {
        const valueType = Array.isArray(value) ? 'array' : typeof value
        if (valueType !== options.type) return false
    }

    if (options.enum && !options.enum.includes(value)) {
        return false
    }

    if (options.regexp && typeof value === 'string' && !options.regexp.test(value)) {
        return false
    }

    if (typeof value === 'string') {
        if (options.minLength !== undefined && value.length < options.minLength) return false
        if (options.maxLength !== undefined && value.length > options.maxLength) return false
    }

    if (typeof value === 'number') {
        if (options.min !== undefined && value < options.min) return false
        if (options.max !== undefined && value > options.max) return false
    }

    if (options.custom && typeof options.custom === 'function') {
        return options.custom(value)
    }

    return true
}
