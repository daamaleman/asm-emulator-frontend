<script setup>
import { computed } from 'vue'
import { useProgramaStore } from '@/stores/programa'

const BANDERAS = [
  { clave: 'zf', nombre: 'ZF', descripcion: 'Cero' },
  { clave: 'sf', nombre: 'SF', descripcion: 'Signo' },
  { clave: 'cf', nombre: 'CF', descripcion: 'Acarreo (sin signo)' },
  { clave: 'of', nombre: 'OF', descripcion: 'Desbordamiento (con signo)' },
]

const store = useProgramaStore()
const actuales = computed(() => store.estadoActual?.flags)
const anteriores = computed(() => store.estadoAnterior?.flags)
</script>

<template>
  <section class="panel">
    <header><h3>Banderas</h3></header>
    <p v-if="!actuales" class="vacio">Sin ejecutar.</p>
    <div v-else class="banderas">
      <div
        v-for="b in BANDERAS"
        :key="b.clave"
        :data-bandera="b.clave"
        class="bandera"
        :class="{
          activa: actuales[b.clave],
          cambio: anteriores && anteriores[b.clave] !== actuales[b.clave],
        }"
        :title="b.descripcion"
      >
        <span class="nombre">{{ b.nombre }}</span>
        <span class="valor">{{ actuales[b.clave] ? 1 : 0 }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banderas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.bandera {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid var(--borde);
  border-radius: 6px;
  font-family: var(--mono);
}
.nombre {
  font-size: 0.8rem;
  color: var(--tenue);
}
.valor {
  font-size: 1.3rem;
}
.activa {
  border-color: var(--ok);
}
.activa .valor {
  color: var(--ok);
}
.cambio {
  background: var(--cambio);
}
</style>