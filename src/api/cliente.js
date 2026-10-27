import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export async function obtenerEstado() {
  const { data } = await http.get('/health')
  return data
}

export async function emular(code, initialRegisters) {
  const { data } = await http.post('/emulate', { code, initialRegisters })
  return data
}

export async function obtenerEjemplos() {
  const { data } = await http.get('/examples')
  return data
}

export default http