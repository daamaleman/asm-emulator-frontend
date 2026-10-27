<script setup>
import { onMounted } from 'vue'
import { useProgramaStore } from '@/stores/programa'
import CodeEditor from '@/components/CodeEditor.vue'
import SelectorEjemplos from '@/components/SelectorEjemplos.vue'
import ValoresIniciales from '@/components/ValoresIniciales.vue'
import BarraControles from '@/components/BarraControles.vue'
import RegistrosPanel from '@/components/RegistrosPanel.vue'
import BanderasPanel from '@/components/BanderasPanel.vue'
import PilaPanel from '@/components/PilaPanel.vue'
import TrazaTabla from '@/components/TrazaTabla.vue'

const store = useProgramaStore()

onMounted(() => {
  if (!store.ejemplos.length) store.cargarEjemplos()
})
</script>

<template>
  <div class="emulador">
    <div class="columna">
      <SelectorEjemplos />
      <CodeEditor
        :model-value="store.codigo"
        :linea-error="store.error?.line ?? null"
        :linea-activa="store.lineaActual"
        @update:model-value="store.actualizarCodigo"
      />
      <ValoresIniciales />
      <BarraControles />

      <p v-if="store.error" class="mensaje error">
        ⚠ <strong v-if="store.error.line">Línea {{ store.error.line }}:</strong>
        {{ store.error.message }}
      </p>
      <p
        v-else-if="store.resultado"
        class="mensaje"
        :class="store.resultado.stopReason === 'STEP_LIMIT' ? 'aviso' : 'ok'"
      >
        {{ store.resultado.stopMessage }} · {{ store.resultado.steps }} pasos
      </p>
    </div>

    <div class="columna">
      <RegistrosPanel />
      <BanderasPanel />
      <PilaPanel />
    </div>

    <TrazaTabla class="completa" />
  </div>
</template>

<style scoped>
.emulador {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}
.columna {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.completa {
  grid-column: 1 / -1;
}
.mensaje {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--borde);
  font-size: 0.9rem;
}
.mensaje.error {
  border-color: var(--error);
  color: var(--error);
}
.mensaje.ok {
  border-color: var(--ok);
  color: var(--ok);
}
.mensaje.aviso {
  border-color: var(--aviso);
  color: var(--aviso);
}
@media (max-width: 960px) {
  .emulador {
    grid-template-columns: 1fr;
  }
}
</style>