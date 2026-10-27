// Los registros llegan como texto hex de 64 bits ("0x00000000FFFFFFFF").
// Se usa BigInt porque Number pierde precisión por encima de 2^53.

const MASCARA_64 = (1n << 64n) - 1n

const VISTAS_32 = {
  RAX: 'EAX', RBX: 'EBX', RCX: 'ECX', RDX: 'EDX',
  RSI: 'ESI', RDI: 'EDI', RBP: 'EBP', RSP: 'ESP',
}

export function aBigInt(hex) {
  return BigInt(hex) & MASCARA_64
}

/** Se queda con los bits bajos del ancho dado (vista EAX de RAX, etc.). */
export function vista(valor, bits) {
  return valor & ((1n << BigInt(bits)) - 1n)
}

/** Interpreta el valor como complemento a dos. */
export function conSigno(valor, bits) {
  const b = BigInt(bits)
  return valor & (1n << (b - 1n)) ? valor - (1n << b) : valor
}

/**
 * @param hex  valor de 64 bits en hexadecimal
 * @param bits 64 o 32
 * @param modo 'hex' | 'signed' | 'unsigned'
 */
export function formatear(hex, bits = 64, modo = 'hex') {
  const valor = vista(aBigInt(hex), bits)
  switch (modo) {
    case 'signed':
      return conSigno(valor, bits).toString()
    case 'unsigned':
      return valor.toString()
    default:
      return '0x' + valor.toString(16).toUpperCase().padStart(bits / 4, '0')
  }
}

/** Nombre de la vista: RAX → EAX, R8 → R8D en 32 bits. */
export function nombreRegistro(id, bits) {
  if (bits === 64) return id
  return VISTAS_32[id] ?? `${id}D`
}