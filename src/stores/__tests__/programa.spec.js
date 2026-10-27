import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProgramaStore } from '../programa'
import { emular } from '@/api/cliente'

vi.mock('@/api/cliente', () => ({ emular: vi.fn(), obtenerEjemplos: vi.fn() }))

function estado(rax) {
  return {
    registers: [{ name: 'RAX', hex: rax, unsigned: '', signed: '' }],
    flags: { zf: false, sf: false, cf: false, of: false },
    rip: 0,
    stack: [],
  }
}

const respuesta = {
  initialState: estado('0x0000000000000000'),
  finalState: estado('0x0000000000000008'),
  trace: [
    { step: 1, line: 2, instruction: 'mov eax, edi', jumpTaken: null, changedRegisters: ['RAX'], state: estado('0x0000000000000008') },
    { step: 2, line: 3, instruction: 'ret', jumpTaken: null, changedRegisters: [], state: estado('0x0000000000000008') },
  ],
  steps: 2,
  stopReason: 'RETURN',
  stopMessage: 'RET',
}

describe('programa store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('ejecutar todo se ubica en el último paso', async () => {
    emular.mockResolvedValue(respuesta)
    const store = useProgramaStore()

    await store.ejecutar('todo')

    expect(store.paso).toBe(1)
    expect(store.terminado).toBe(true)
    expect(store.estadoActual).toEqual(respuesta.trace[1].state)
  })

  it('paso a paso empieza en el estado inicial y avanza', async () => {
    emular.mockResolvedValue(respuesta)
    const store = useProgramaStore()

    await store.ejecutar('pasos')
    expect(store.paso).toBe(-1)
    expect(store.estadoActual).toEqual(respuesta.initialState)

    store.siguiente()
    expect(store.paso).toBe(0)
    expect(store.cambiados).toEqual(['RAX'])
    expect(store.lineaActual).toBe(2)

    store.anterior()
    expect(store.paso).toBe(-1)
  })

  it('guarda el error de sintaxis con su línea', async () => {
    emular.mockRejectedValue({ response: { data: { message: "Instrucción desconocida 'MOVE'", line: 2 } } })
    const store = useProgramaStore()

    await store.ejecutar()

    expect(store.resultado).toBeNull()
    expect(store.error).toEqual({ message: "Instrucción desconocida 'MOVE'", line: 2 })
  })

  it('informa cuando el backend no responde', async () => {
    emular.mockRejectedValue(new Error('Network Error'))
    const store = useProgramaStore()

    await store.ejecutar()

    expect(store.error.message).toBe('No se pudo conectar con el backend')
  })

  it('seleccionar un ejemplo carga su código y valores', () => {
    const store = useProgramaStore()
    store.ejemplos = [{ id: 'sumar', title: 'Sumar', code: 'ret', initialRegisters: { EDI: '3' } }]

    store.seleccionarEjemplo('sumar')

    expect(store.codigo).toBe('ret')
    expect(store.valoresIniciales.EDI).toBe('3')
    expect(store.valoresIniciales.ESI).toBe('')
  })
})
