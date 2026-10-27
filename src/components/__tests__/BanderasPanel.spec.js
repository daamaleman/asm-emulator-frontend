import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BanderasPanel from '../BanderasPanel.vue'
import { useProgramaStore } from '@/stores/programa'

function estado(flags) {
  return { registers: [], flags, rip: 0, stack: [] }
}

describe('BanderasPanel', () => {
  it('muestra las banderas del estado actual', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useProgramaStore()
    store.resultado = {
      initialState: estado({ zf: true, sf: false, cf: false, of: false }),
      trace: [],
    }

    const wrapper = mount(BanderasPanel, { global: { plugins: [pinia] } })

    expect(wrapper.find('[data-bandera="zf"]').text()).toContain('1')
    expect(wrapper.find('[data-bandera="cf"]').text()).toContain('0')
  })

  it('indica que no hay ejecución', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(BanderasPanel, { global: { plugins: [pinia] } })

    expect(wrapper.text()).toContain('Sin ejecutar')
  })
})
