<script setup>
import { computed } from 'vue'
import { useProgramaStore } from '@/stores/programa'
import { formatear, nombreRegistro } from '@/utils/formato'

const BANDERAS = ['zf', 'sf', 'cf', 'of']
const store = useProgramaStore()

function describirCambios(paso) {
  return paso.changedRegisters
    .map((id) => {
      const r = paso.state.registers.find((x) => x.name === id)
      return `${nombreRegistro(id, 32)} = ${formatear(r.hex, 32, 'signed')}`
    })
    .join(', ')
}

const filas = computed(() =>
  store.traza.slice(0, store.paso + 1).map((p, indice) => ({
    indice,
    paso: p.step,
    linea: p.line,
    instruccion: p.instruction,
    salto: p.jumpTaken === null ? '—' : p.jumpTaken ? 'Sí' : 'No',
    cambios: describirCambios(p),
    flags: p.state.flags,
  })),
)
</script>

<template>
  <section class="panel">
    <header>
      <h3>Traza</h3>
      <span v-if="store.resultado" class="vacio">Haz clic en una fila para ir a ese paso</span>
    </header>

    <p v-if="!store.resultado" class="vacio">Aquí aparecerá cada instrucción ejecutada.</p>
    <p v-else-if="!filas.length" class="vacio">Estado inicial. Pulsa ▶ para ejecutar la primera instrucción.</p>
    <div v-else class="scroll">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Línea</th>
            <th>Instrucción</th>
            <th>¿Salto?</th>
            <th>Cambios</th>
            <th v-for="b in BANDERAS" :key="b">{{ b.toUpperCase() }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="f in filas"
            :key="f.indice"
            :class="{ actual: f.indice === store.paso }"
            @click="store.irA(f.indice)"
          >
            <td>{{ f.paso }}</td>
            <td>{{ f.linea }}</td>
            <td class="instruccion">{{ f.instruccion }}</td>
            <td :class="{ tomado: f.salto === 'Sí' }">{{ f.salto }}</td>
            <td>{{ f.cambios }}</td>
            <td v-for="b in BANDERAS" :key="b">{{ f.flags[b] ? 1 : 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.scroll {
  max-height: 320px;
  overflow: auto;
}
thead th {
  position: sticky;
  top: 0;
  background: var(--panel);
  color: var(--tenue);
  font-weight: normal;
}
tbody tr {
  cursor: pointer;
}
tbody tr:hover {
  background: var(--borde);
}
tr.actual {
  background: var(--cambio);
}
.instruccion {
  white-space: pre;
}
.tomado {
  color: var(--ok);
  font-weight: 600;
}
</style>