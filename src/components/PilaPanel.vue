<script setup>
import { computed } from 'vue'
import { useProgramaStore } from '@/stores/programa'
import { aBigInt, formatear } from '@/utils/formato'

const store = useProgramaStore()

const filas = computed(() => {
  const estado = store.estadoActual
  if (!estado) return []
  const rsp = aBigInt(estado.registers.find((r) => r.name === 'RSP').hex)
  return estado.stack.map((e) => {
    const direccion = aBigInt(e.address)
    return {
      direccion: formatear(e.address, 32, 'hex'),
      valor: formatear(e.value, 64, 'signed'),
      tope: direccion === rsp,
      libre: direccion < rsp, // ya se hizo POP de este valor
    }
  })
})
</script>

<template>
  <section class="panel">
    <header><h3>Pila</h3></header>
    <p v-if="!filas.length" class="vacio">Vacía. Usa PUSH para guardar valores.</p>
    <table v-else>
      <tbody>
        <tr v-for="f in filas" :key="f.direccion" :class="{ libre: f.libre }">
          <th>{{ f.direccion }}</th>
          <td>{{ f.valor }}</td>
          <td class="tope">{{ f.tope ? '← RSP' : '' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
th {
  color: var(--tenue);
  font-weight: normal;
}
.tope {
  color: var(--acento);
  width: 4.5rem;
}
.libre {
  opacity: 0.4;
}
</style>