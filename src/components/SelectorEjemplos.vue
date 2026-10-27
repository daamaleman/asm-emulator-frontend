<script setup>
import { computed } from 'vue'
import { useProgramaStore } from '@/stores/programa'

const store = useProgramaStore()

const porSesion = computed(() => {
  const grupos = {}
  for (const e of store.ejemplos) (grupos[e.session] ??= []).push(e)
  return grupos
})

const ejemplo = computed(() => store.ejemplos.find((e) => e.id === store.ejemploId))
</script>

<template>
  <div class="selector">
    <label for="ejemplo">Ejemplo de clase</label>
    <select
      id="ejemplo"
      :value="store.ejemploId"
      :disabled="!store.ejemplos.length"
      @change="store.seleccionarEjemplo($event.target.value)"
    >
      <option value="" disabled>Elige un ejemplo…</option>
      <optgroup v-for="(lista, sesion) in porSesion" :key="sesion" :label="sesion">
        <option v-for="e in lista" :key="e.id" :value="e.id">{{ e.title }}</option>
      </optgroup>
    </select>
    <code v-if="ejemplo" class="c">C: {{ ejemplo.cEquivalent }}</code>
  </div>
</template>

<style scoped>
.selector {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}
label {
  color: var(--tenue);
  font-size: 0.9rem;
}
.c {
  flex-basis: 100%;
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--tenue);
}
</style>