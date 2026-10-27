<script setup>
import { useProgramaStore } from '@/stores/programa'

const store = useProgramaStore()
</script>

<template>
  <div class="controles">
    <button class="primario" :disabled="store.cargando" @click="store.ejecutar('todo')">
      ▶ Ejecutar todo
    </button>
    <button :disabled="store.cargando" @click="store.ejecutar('pasos')">Paso a paso</button>

    <template v-if="store.resultado">
      <span class="separador"></span>
      <button title="Estado inicial" :disabled="store.paso < 0" @click="store.irA(-1)">⏮</button>
      <button title="Paso anterior" :disabled="store.paso < 0" @click="store.anterior()">◀</button>
      <span class="contador">Paso {{ store.paso + 1 }} / {{ store.totalPasos }}</span>
      <button title="Paso siguiente" :disabled="store.terminado" @click="store.siguiente()">▶</button>
      <button title="Último paso" :disabled="store.terminado" @click="store.irA(store.totalPasos - 1)">
        ⏭
      </button>
    </template>

    <button class="reiniciar" @click="store.limpiarResultado()">Reiniciar</button>
  </div>
</template>

<style scoped>
.controles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.separador {
  width: 1px;
  height: 1.6rem;
  background: var(--borde);
  margin: 0 0.3rem;
}
.contador {
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--tenue);
  min-width: 7rem;
  text-align: center;
}
.reiniciar {
  margin-left: auto;
}
</style>