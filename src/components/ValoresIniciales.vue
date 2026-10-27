<script setup>
import { useProgramaStore } from '@/stores/programa'

const store = useProgramaStore()
</script>

<template>
  <fieldset class="panel valores">
    <legend>Valores iniciales</legend>
    <label v-for="(_, nombre) in store.valoresIniciales" :key="nombre">
      <span>{{ nombre }}</span>
      <input v-model="store.valoresIniciales[nombre]" placeholder="0" spellcheck="false" />
    </label>
    <p class="vacio">Decimal, negativo o hex (0x10). En System V: EDI = a, ESI = b.</p>
  </fieldset>
</template>

<style scoped>
.valores {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  align-items: center;
}
legend {
  padding: 0 0.4rem;
  color: var(--tenue);
  font-size: 0.85rem;
}
label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--mono);
}
input {
  width: 7.5rem;
}
.vacio {
  flex-basis: 100%;
}
</style>