import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { emular, obtenerEjemplos } from '@/api/cliente'

const CODIGO_INICIAL = `; Escribe tu código x86-64 (sintaxis Intel)
mayor:
    mov eax, edi
    cmp edi, esi
    jg fin
    mov eax, esi
fin:
    ret
`

const ENTRADAS_VACIAS = { EDI: '', ESI: '', EDX: '', ECX: '' }

export const useProgramaStore = defineStore('programa', () => {
  // --- estado ---
  const codigo = ref(CODIGO_INICIAL)
  const valoresIniciales = ref({ ...ENTRADAS_VACIAS, EDI: '8', ESI: '5' })
  const ejemplos = ref([])
  const ejemploId = ref('')
  const resultado = ref(null) // respuesta de /api/emulate
  const error = ref(null) // { message, line }
  const cargando = ref(false)
  const paso = ref(-1) // -1 = estado inicial; i = después de trace[i]

  // --- derivados ---
  const traza = computed(() => resultado.value?.trace ?? [])
  const totalPasos = computed(() => traza.value.length)
  const pasoActual = computed(() => (paso.value >= 0 ? traza.value[paso.value] : null))

  const estadoActual = computed(() => {
    if (!resultado.value) return null
    return pasoActual.value ? pasoActual.value.state : resultado.value.initialState
  })

  const estadoAnterior = computed(() => {
    if (!resultado.value || paso.value < 0) return null
    return paso.value === 0 ? resultado.value.initialState : traza.value[paso.value - 1].state
  })

  const cambiados = computed(() => pasoActual.value?.changedRegisters ?? [])
  const lineaActual = computed(() => pasoActual.value?.line ?? null)
  const terminado = computed(() => paso.value >= totalPasos.value - 1)

  // --- acciones ---
  async function cargarEjemplos() {
    try {
      ejemplos.value = await obtenerEjemplos()
    } catch {
      ejemplos.value = []
    }
  }

  function seleccionarEjemplo(id) {
    const ejemplo = ejemplos.value.find((e) => e.id === id)
    if (!ejemplo) return
    ejemploId.value = id
    codigo.value = ejemplo.code
    valoresIniciales.value = { ...ENTRADAS_VACIAS, ...ejemplo.initialRegisters }
    limpiarResultado()
  }

  function actualizarCodigo(nuevo) {
    codigo.value = nuevo
    error.value = null
  }

  /** @param modo 'todo' muestra el final; 'pasos' empieza en el estado inicial */
  async function ejecutar(modo = 'todo') {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await emular(codigo.value, valoresIniciales.value)
      resultado.value = respuesta
      paso.value = modo === 'todo' ? respuesta.trace.length - 1 : -1
    } catch (e) {
      resultado.value = null
      paso.value = -1
      error.value = traducirError(e)
    } finally {
      cargando.value = false
    }
  }

  function siguiente() {
    if (paso.value < totalPasos.value - 1) paso.value++
  }

  function anterior() {
    if (paso.value > -1) paso.value--
  }

  function irA(indice) {
    paso.value = Math.max(-1, Math.min(indice, totalPasos.value - 1))
  }

  function limpiarResultado() {
    resultado.value = null
    error.value = null
    paso.value = -1
  }

  return {
    codigo, valoresIniciales, ejemplos, ejemploId, resultado, error, cargando, paso,
    traza, totalPasos, pasoActual, estadoActual, estadoAnterior, cambiados, lineaActual, terminado,
    cargarEjemplos, seleccionarEjemplo, actualizarCodigo, ejecutar, siguiente, anterior, irA,
    limpiarResultado,
  }
})

function traducirError(e) {
  const data = e?.response?.data
  if (data?.message) return { message: data.message, line: data.line ?? null }
  return { message: 'No se pudo conectar con el backend', line: null }
}