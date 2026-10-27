<script setup>
import { computed, ref } from 'vue'
import { useProgramaStore } from '@/stores/programa'
import { formatear, nombreRegistro } from '@/utils/formato'

const store = useProgramaStore()
const ancho = ref(32)
const modo = ref('signed')

const filas = computed(() =>
  (store.estadoActual?.registers ?? []).map((r) => ({
    id: r.name,
    nombre: nombreRegistro(r.name, ancho.value),
    valor: formatear(r.hex, ancho.value, modo.value),
    cambio: store.cambiados.includes(r.name),
  })),
)
</script>

<template>
  <section class="panel">
    <header>
      <h3>Registros</h3>
      <div class="opciones">
        <select v-model.number="ancho" aria-label="Ancho">
          <option :value="32">32 bits</option>
          <option :value="64">64 bits</option>
        </select>
        <select v-model="modo" aria-label="Formato">
          <option value="signed">Decimal con signo</option>
          <option value="unsigned">Decimal sin signo</option>
          <option value="hex">Hexadecimal</option>
        </select>
      </div>
    </header>

    <p v-if="!store.estadoActual" class="vacio">Ejecuta el código para ver los registros.</p>
    <template v-else>
      <table>
        <tbody>
          <tr v-for="f in filas" :key="f.id" :class="{ cambio: f.cambio }">
            <th>{{ f.nombre }}</th>
            <td>{{ f.valor }}</td>
          </tr>
        </tbody>
      </table>
      <p class="vacio rip">RIP → instrucción #{{ store.estadoActual.rip }}</p>
    </template>
  </section>
</template>

<style scoped>
.opciones {
  display: flex;
  gap: 0.4rem;
}
th {
  width: 5rem;
  color: var(--tenue);
  font-weight: normal;
}
tr.cambio {
  background: var(--cambio);
}
tr.cambio th,
tr.cambio td {
  color: var(--acento);
  font-weight: 600;
}
.rip {
  margin-top: 0.5rem;
}
</style>