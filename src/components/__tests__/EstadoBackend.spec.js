import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EstadoBackend from '../EstadoBackend.vue'
import { obtenerEstado } from '@/api/cliente'

vi.mock('@/api/cliente', () => ({ obtenerEstado: vi.fn() }))

describe('EstadoBackend', () => {
  beforeEach(() => vi.clearAllMocks())

  it('muestra la versión cuando el backend responde', async () => {
    obtenerEstado.mockResolvedValue({ status: 'UP', version: '0.1.0' })
    const wrapper = mount(EstadoBackend)
    await flushPromises()
    expect(wrapper.text()).toContain('Backend v0.1.0')
  })

  it('indica desconexión cuando la petición falla', async () => {
    obtenerEstado.mockRejectedValue(new Error('Network Error'))
    const wrapper = mount(EstadoBackend)
    await flushPromises()
    expect(wrapper.text()).toContain('Backend no disponible')
  })
})