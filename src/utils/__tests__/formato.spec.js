import { describe, it, expect } from 'vitest'
import { formatear, nombreRegistro } from '../formato'

describe('formatear', () => {
  it('muestra la vista de 32 bits con signo', () => {
    expect(formatear('0x00000000FFFFFFFF', 32, 'signed')).toBe('-1')
  })

  it('muestra la vista de 32 bits sin signo', () => {
    expect(formatear('0x00000000FFFFFFFF', 32, 'unsigned')).toBe('4294967295')
  })

  it('rellena el hexadecimal según el ancho', () => {
    expect(formatear('0x0000000000000010', 32, 'hex')).toBe('0x00000010')
    expect(formatear('0x0000000000000010', 64, 'hex')).toBe('0x0000000000000010')
  })

  it('no pierde precisión con 64 bits', () => {
    expect(formatear('0xFFFFFFFFFFFFFFFF', 64, 'unsigned')).toBe('18446744073709551615')
    expect(formatear('0xFFFFFFFFFFFFFFFF', 64, 'signed')).toBe('-1')
  })

  it('la vista de 32 bits ignora la parte alta', () => {
    expect(formatear('0x1122334400000008', 32, 'signed')).toBe('8')
  })
})

describe('nombreRegistro', () => {
  it('traduce a la vista de 32 bits', () => {
    expect(nombreRegistro('RAX', 32)).toBe('EAX')
    expect(nombreRegistro('RDI', 32)).toBe('EDI')
    expect(nombreRegistro('R8', 32)).toBe('R8D')
  })

  it('mantiene el nombre en 64 bits', () => {
    expect(nombreRegistro('RSI', 64)).toBe('RSI')
  })
})
